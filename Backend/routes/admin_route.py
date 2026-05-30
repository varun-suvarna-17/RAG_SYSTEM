import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database.db_connect import get_connection
from auth.auth_handler import verify_admin, create_access_token
from auth.dependencies import require_admin
from embeddings.faiss_store import build_faiss_index

router = APIRouter()

# ── Auth ─────────────────────────────────────────────────────────
class AdminLogin(BaseModel):
    username: str
    password: str

@router.post("/admin/login")
async def admin_login(creds: AdminLogin):
    if verify_admin(creds.username, creds.password):
        try:
            token = create_access_token(creds.username)
        except ValueError:
            raise HTTPException(
                status_code=500,
                detail="Server misconfigured: ADMIN_SECRET_KEY not set",
            )
        return {
            "status": "success",
            "message": "Login successful",
            "token": token,
            "username": creds.username,
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")


# ── Add Data ─────────────────────────────────────────────────────
class DepartmentIn(BaseModel):
    name: str
    hod_name: str
    description: str

class CourseIn(BaseModel):
    dept_id: int
    course_name: str
    course_code: str
    credits: int
    semester: int

class FacultyIn(BaseModel):
    dept_id: int
    name: str
    designation: str
    email: str
    specialization: str

class FeeIn(BaseModel):
    dept_id: int
    year: int
    amount: float
    due_date: str       # "YYYY-MM-DD"

class NoticeIn(BaseModel):
    title: str
    content: str
    category: str       # 'exam', 'event', 'holiday'
    posted_on: str      # "YYYY-MM-DD"

class StudentIn(BaseModel):
    name: str
    roll_number: str
    dept_id: int
    email: str
    year: int


@router.post("/admin/add/department")
async def add_department(data: DepartmentIn, _admin: str = Depends(require_admin)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO departments (name, hod_name, description) VALUES (%s, %s, %s)",
        (data.name, data.hod_name, data.description)
    )
    conn.commit()
    cursor.close(); conn.close()
    return {"status": "success", "message": f"Department '{data.name}' added"}


@router.post("/admin/add/course")
async def add_course(data: CourseIn, _admin: str = Depends(require_admin)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO courses (dept_id, course_name, course_code, credits, semester)
           VALUES (%s, %s, %s, %s, %s)""",
        (data.dept_id, data.course_name, data.course_code, data.credits, data.semester)
    )
    conn.commit()
    cursor.close(); conn.close()
    return {"status": "success", "message": f"Course '{data.course_name}' added"}


@router.post("/admin/add/faculty")
async def add_faculty(data: FacultyIn, _admin: str = Depends(require_admin)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO faculty (dept_id, name, designation, email, specialization)
           VALUES (%s, %s, %s, %s, %s)""",
        (data.dept_id, data.name, data.designation, data.email, data.specialization)
    )
    conn.commit()
    cursor.close(); conn.close()
    return {"status": "success", "message": f"Faculty '{data.name}' added"}


@router.post("/admin/add/fee")
async def add_fee(data: FeeIn, _admin: str = Depends(require_admin)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO fees (dept_id, year, amount, due_date) VALUES (%s, %s, %s, %s)",
        (data.dept_id, data.year, data.amount, data.due_date)
    )
    conn.commit()
    cursor.close(); conn.close()
    return {"status": "success", "message": "Fee record added"}


@router.post("/admin/add/notice")
async def add_notice(data: NoticeIn, _admin: str = Depends(require_admin)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO notices (title, content, category, posted_on) VALUES (%s,%s,%s,%s)",
        (data.title, data.content, data.category, data.posted_on)
    )
    conn.commit()
    cursor.close(); conn.close()
    return {"status": "success", "message": f"Notice '{data.title}' added"}


@router.post("/admin/add/student")
async def add_student(data: StudentIn, _admin: str = Depends(require_admin)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO students (name, roll_number, dept_id, email, year)
           VALUES (%s, %s, %s, %s, %s)""",
        (data.name, data.roll_number, data.dept_id, data.email, data.year)
    )
    conn.commit()
    cursor.close(); conn.close()
    return {"status": "success", "message": f"Student '{data.name}' added"}


# ── View Data ────────────────────────────────────────────────────
@router.get("/admin/data/{table_name}")
async def get_table_data(table_name: str, _admin: str = Depends(require_admin)):
    allowed = ["departments","courses","faculty","fees","notices","students","audit_logs"]
    if table_name not in allowed:
        raise HTTPException(status_code=400, detail="Table not allowed")

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name} ORDER BY id DESC LIMIT 100")
    rows = cursor.fetchall()
    cols = [desc[0] for desc in cursor.description]
    cursor.close(); conn.close()

    return {
        "table": table_name,
        "count": len(rows),
        "data": [dict(zip(cols, row)) for row in rows]
    }


# ── Rebuild FAISS ────────────────────────────────────────────────
@router.post("/admin/rebuild-index")
async def admin_rebuild_index(_admin: str = Depends(require_admin)):
    try:
        build_faiss_index()
        return {"status": "success", "message": "FAISS index rebuilt ✅"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
