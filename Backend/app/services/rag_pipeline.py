import time
from app.services.llm_service import translate_to_sql, generate_natural_language_response
from app.db.database import execute_read_query, log_query

def process_query(query: str, student_id: int = 0):
    start_time = time.time()
    
    try:
        # Step 1: Translate NL to SQL
        sql_query = translate_to_sql(query)
        print(f"[RAG] Generated SQL: {sql_query}")
        
        if not sql_query or sql_query.strip() == "":
            return "No answer."

        # Step 2: Execute SQL Query
        results = execute_read_query(sql_query)
        print(f"[RAG] Query Results: {results}")
        
        # Step 3: Check for empty results
        if not results:
            return "No answer."

        # Step 4: Generate NL Response
        response = generate_natural_language_response(query, results)
        
        # Step 5: Log Query
        response_time = time.time() - start_time
        try:
            log_query(student_id, response_time)
        except Exception as log_err:
            print(f"[RAG] Log error (non-fatal): {log_err}")

        return response

    except Exception as e:
        print(f"[RAG] Pipeline Error: {type(e).__name__}: {e}")
        # Return descriptive error for debugging
        return f"⚠️ Error: {type(e).__name__}: {str(e)[:300]}"
