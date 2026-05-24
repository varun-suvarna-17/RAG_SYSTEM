import google.generativeai as genai
import os
import re
import time
from dotenv import load_dotenv
from app.models.schema import SCHEMA_CONTEXT

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Try models in priority order — first one that responds wins
MODELS_TO_TRY = [
    'models/gemma-4-31b-it',
    'models/gemma-3-27b-it',
    'models/gemma-3-12b-it',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.5-flash',
]

def _call_model(prompt: str) -> str:
    """Try each model in order, returning the first successful response."""
    last_err = None
    for model_name in MODELS_TO_TRY:
        try:
            model = genai.GenerativeModel(model_name)
            resp = model.generate_content(prompt, request_options={'timeout': 20})
            return resp.text.strip()
        except Exception as e:
            last_err = e
            time.sleep(0.5)
            continue
    raise RuntimeError(f"All models failed. Last error: {last_err}")


# ──────────────────────────────────────────────────────────────
# RULE-BASED SQL FALLBACK  (works even when AI models are down)
# ──────────────────────────────────────────────────────────────
DEPT_MAP = {
    'cs': 'Computer Science', 'cse': 'Computer Science',
    'is': 'Information Science', 'ise': 'Information Science',
    'ec': 'Electronics', 'ece': 'Electronics',
    'me': 'Mechanical', 'cv': 'Civil',
    'mba': 'MBA', 'mca': 'MCA',
}

def _rule_based_sql(query: str):
    """Return SQL for common patterns using verified real column names."""
    q = query.lower().strip()

    # HOD query — needs JOIN on Dept_Name and HOD_Faculty_ID
    if 'hod' in q or 'head of department' in q:
        dept_key = None
        for abbr in DEPT_MAP:
            if re.search(r'\b' + abbr + r'\b', q):
                dept_key = abbr
                break
        dept_name = DEPT_MAP.get(dept_key, '') if dept_key else ''
        if dept_name:
            return (
                "SELECT f.Name, f.Designation, f.Email FROM Faculty f "
                "JOIN Department d ON f.Faculty_ID = d.HOD_Faculty_ID "
                f"WHERE d.Dept_Name LIKE '%{dept_name}%'"
            )
        else:
            return (
                "SELECT f.Name, f.Designation, d.Dept_Name FROM Faculty f "
                "JOIN Department d ON f.Faculty_ID = d.HOD_Faculty_ID"
            )

    # All faculty
    if any(k in q for k in ['all faculty', 'list faculty', 'faculty list', 'all teachers', 'faculty details', 'faculty contacts']):
        return "SELECT Name, Designation, Email, Phone FROM Faculty"

    # Courses by semester
    m = re.search(r'(?:courses?|subjects?).{0,25}sem(?:ester)?\s*(\d+)', q)
    if not m:
        m = re.search(r'sem(?:ester)?\s*(\d+).{0,25}(?:courses?|subjects?)', q)
    if m:
        sem = m.group(1)
        return f"SELECT Course_Name, Credits FROM Courses WHERE Semester = {sem}"

    # Department info
    if 'department' in q or 'dept' in q:
        dept_key = None
        for abbr in DEPT_MAP:
            if re.search(r'\b' + abbr + r'\b', q):
                dept_key = abbr
                break
        if dept_key:
            dept_name = DEPT_MAP[dept_key]
            return f"SELECT Dept_Name, Location, Description FROM Department WHERE Dept_Name LIKE '%{dept_name}%'"
        return "SELECT Dept_Name, Location FROM Department"

    # All courses
    if re.search(r'all\s+course|list\s+course|courses?\s+available', q):
        return "SELECT Course_Name, Credits, Semester FROM Courses ORDER BY Semester"

    return None


def translate_to_sql(user_query: str) -> str:
    # First, try the rule-based shortcut (instant, no API call needed)
    rule_sql = _rule_based_sql(user_query)
    if rule_sql:
        print(f"[LLM] Using rule-based SQL: {rule_sql}")
        return rule_sql

    # Fallback: use AI model
    prompt = f"""
{SCHEMA_CONTEXT}

Task: Convert the question below into a single valid MySQL SELECT query.
Return ONLY the SQL. No markdown, no backticks, no explanation.

Question: {user_query}
SQL:"""
    try:
        sql = _call_model(prompt)
        # Strip any stray markdown
        for p in ['```sql', '```mysql', '```']:
            if sql.lower().startswith(p):
                sql = sql[len(p):]
        if sql.endswith('```'):
            sql = sql[:-3]
        sql = sql.strip()
        print(f"[LLM] AI SQL: {sql[:120]}")
        return sql
    except Exception as e:
        print(f"[LLM] AI translation failed: {e}")
        return ""


def generate_natural_language_response(user_query: str, data: list) -> str:
    if not data:
        return "No answer."

    # Simple rule-based formatting for quick responses
    if len(data) == 1 and len(data[0]) <= 3:
        row = data[0]
        vals = list(row.values())
        keys = list(row.keys())
        # Single-row single-value response
        if len(vals) == 1:
            return f"{vals[0]}"
        # Name + Designation type
        if 'Name' in keys:
            parts = [f"**{row['Name']}**"]
            for k, v in row.items():
                if k != 'Name' and v:
                    parts.append(f"{k}: {v}")
            return "\n\n".join(parts)

    # For richer results, try AI
    prompt = f"""You are an AI assistant for Sahyadri College of Engineering & Management.
Answer this question using the database results below. Be direct and friendly. No fluff.

Question: {user_query}
Data: {data}

Answer:"""
    try:
        return _call_model(prompt)
    except Exception:
        # Fallback: format raw data nicely
        lines = []
        for row in data:
            lines.append(" | ".join(f"{k}: {v}" for k, v in row.items() if v))
        return "\n".join(lines) if lines else "No answer."
