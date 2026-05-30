import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import faiss
import numpy as np
import json
from embeddings.embedder import get_embeddings_batch
from database.db_connect import get_connection

INDEX_PATH = "embeddings/faiss.index"
METADATA_PATH = "embeddings/metadata.json"
# ↑ metadata maps FAISS result index → original DB row text

def fetch_all_data():
    """Pull all rows from DB and convert to readable text chunks"""
    conn = get_connection()
    cursor = conn.cursor()
    chunks = []  # each chunk = one piece of text FAISS will index

    # Departments
    cursor.execute("SELECT name, hod_name, description FROM departments")
    for row in cursor.fetchall():
        chunks.append(f"Department: {row[0]}. HOD: {row[1]}. Info: {row[2]}")

    # Courses
    cursor.execute("""
        SELECT c.course_name, c.course_code, c.credits, c.semester, d.name 
        FROM courses c JOIN departments d ON c.dept_id = d.id
    """)
    for row in cursor.fetchall():
        chunks.append(
            f"Course: {row[0]} (Code: {row[1]}) in {row[4]} dept. "
            f"Credits: {row[2]}, Semester: {row[3]}"
        )

    # Faculty
    cursor.execute("""
        SELECT f.name, f.designation, f.email, f.specialization, d.name 
        FROM faculty f JOIN departments d ON f.dept_id = d.id
    """)
    for row in cursor.fetchall():
        chunks.append(
            f"Faculty: {row[0]}, {row[1]} in {row[4]} dept. "
            f"Email: {row[2]}. Specialization: {row[3]}"
        )

    # Fees
    cursor.execute("""
        SELECT d.name, f.year, f.amount, f.due_date 
        FROM fees f JOIN departments d ON f.dept_id = d.id
    """)
    for row in cursor.fetchall():
        chunks.append(
            f"Fees for {row[0]} department: Year {row[1]}, "
            f"Amount: {row[2]}, Due date: {row[3]}"
        )

    # Notices
    cursor.execute("SELECT title, content, category, posted_on FROM notices")
    for row in cursor.fetchall():
        chunks.append(
            f"Notice ({row[2]}): {row[0]}. {row[1]} Posted on: {row[3]}"
        )

    cursor.close()
    conn.close()
    return chunks


def build_faiss_index():
    """Build and save FAISS index from DB data"""
    print("📦 Fetching data from PostgreSQL...")
    chunks = fetch_all_data()

    if not chunks:
        print("⚠️  No data found in DB. Add some rows first!")
        return

    print(f"🔢 Converting {len(chunks)} chunks to embeddings...")
    embeddings = get_embeddings_batch(chunks)

    # Normalize for cosine similarity
    faiss.normalize_L2(embeddings)

    dimension = embeddings.shape[1]  # 384 for all-MiniLM-L6-v2
    index = faiss.IndexFlatIP(dimension)  # IP = Inner Product (cosine after normalize)
    index.add(embeddings)

    # Save index
    faiss.write_index(index, INDEX_PATH)

    # Save metadata (so we know WHICH chunk matched)
    with open(METADATA_PATH, "w") as f:
        json.dump(chunks, f, indent=2, default=str)

    print(f"✅ FAISS index built with {index.ntotal} vectors")
    print(f"✅ Saved to {INDEX_PATH}")


def search_faiss(query_text: str, top_k: int = 3):
    """Search FAISS index for most relevant chunks"""
    if not os.path.exists(INDEX_PATH):
        print("❌ No FAISS index found. Run build_faiss_index() first!")
        return []

    index = faiss.read_index(INDEX_PATH)

    with open(METADATA_PATH, "r") as f:
        metadata = json.load(f)

    from embeddings.embedder import get_embedding
    query_vec = get_embedding(query_text).reshape(1, -1).astype(np.float32)
    faiss.normalize_L2(query_vec)

    scores, indices = index.search(query_vec, top_k)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        if idx != -1:
            results.append({
                "text": metadata[idx],
                "score": float(score)
            })
    return results


if __name__ == "__main__":
    build_faiss_index()

    print("\n🔍 Testing search...")
    results = search_faiss("computer science fees", top_k=3)
    for i, r in enumerate(results):
        print(f"\nResult {i+1} (score: {r['score']:.3f}):")
        print(f"  {r['text']}")