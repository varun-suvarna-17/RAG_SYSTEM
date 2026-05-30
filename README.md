# void.ai — College RAG System

**void.ai** is an AI-powered college knowledge assistant that lets students ask natural-language questions about departments, courses, faculty, fees, notices, and more. Admins can manage college data through a dashboard, and the system uses **RAG (Retrieval-Augmented Generation)** to retrieve relevant records from PostgreSQL and generate accurate answers with **Groq (Llama 3)**.

---

## Features

### Student
- **AI Chat** — Ask questions in plain English and get context-aware answers
- **Conversation History** — View past questions and responses
- **Smart Suggestions** — Quick-start prompts on the chat page

### Admin
- **Secure Login** — Admin authentication with hashed passwords
- **Data Management** — Add departments, courses, faculty, fees, notices, and students
- **View Data** — Browse database tables in a responsive UI
- **Rebuild FAISS Index** — Refresh the vector index after data updates

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Zustand, Axios, React Router, GSAP, React Icons |
| **Backend** | FastAPI, Uvicorn, Python 3.10+ |
| **Database** | PostgreSQL |
| **AI / RAG** | Sentence Transformers (`all-MiniLM-L6-v2`), FAISS, Groq API (Llama 3) |

---

## Project Structure

```
RAG_SYSTEM/
├── Backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Environment & DB config
│   ├── auth/                   # Admin authentication
│   ├── database/               # PostgreSQL connection
│   ├── embeddings/             # FAISS index & embedder
│   ├── rag/                    # Retriever + LLM generator
│   └── routes/                 # API route handlers
│       ├── query_route.py
│       ├── conversation_route.py
│       └── admin_route.py
│
└── Frontend/
    ├── src/
    │   ├── api/                # Axios client
    │   ├── store/              # Zustand (auth + chat)
    │   ├── components/         # Reusable UI components
    │   └── pages/              # Landing, Chat, Admin, History
    └── package.json
```

---

## Prerequisites

Make sure you have these installed before setup:

- **Python 3.10+**
- **Node.js 18+** and **npm**
- **PostgreSQL 14+**
- **Groq API key** — get one free at [console.groq.com](https://console.groq.com)

---

## Setup Guide

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd RAG_SYSTEM
```

### 2. PostgreSQL database

Open PostgreSQL and create the database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE college_rag;
\c college_rag
```

Run the schema below to create all required tables:

```sql
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(64) NOT NULL
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    hod_name VARCHAR(150),
    description TEXT
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    dept_id INTEGER REFERENCES departments(id),
    course_name VARCHAR(150) NOT NULL,
    course_code VARCHAR(20),
    credits INTEGER,
    semester INTEGER
);

CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    dept_id INTEGER REFERENCES departments(id),
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(100),
    email VARCHAR(150),
    specialization VARCHAR(200)
);

CREATE TABLE fees (
    id SERIAL PRIMARY KEY,
    dept_id INTEGER REFERENCES departments(id),
    year INTEGER,
    amount DECIMAL(10, 2),
    due_date DATE
);

CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    category VARCHAR(50),
    posted_on DATE
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    roll_number VARCHAR(50) UNIQUE,
    dept_id INTEGER REFERENCES departments(id),
    email VARCHAR(150),
    year INTEGER
);

CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    question TEXT NOT NULL,
    answer TEXT,
    top_score FLOAT,
    model_used VARCHAR(100),
    tokens_used INTEGER,
    asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Exit psql:

```sql
\q
```

### 3. Backend setup

```bash
cd Backend

# Create and activate virtual environment (recommended)
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file inside `Backend/`:

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_rag
DB_USER=postgres
DB_PASSWORD=your_password_here

# Groq API
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

# Admin auth — generate with: python -c "import secrets; print(secrets.token_hex(32))"
ADMIN_SECRET_KEY=change_this_to_a_long_random_secret

# One-time admin setup (used by: python auth/auth_handler.py)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=choose_a_strong_password

# CORS — comma-separated frontend URLs
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Create the admin user (reads `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env`):

```bash
python auth/auth_handler.py
```

> Never commit your real `.env` file. Only `.env.example` belongs in git.

Test the database connection:

```bash
python database/db_connect.py
```

Build the FAISS vector index (required before chat works with data):

```bash
python embeddings/faiss_store.py
```

Or rebuild later from the **Admin Dashboard → Rebuild Index** button.

Start the backend server:

```bash
python -m uvicorn main:app --reload
```

Backend runs at: **http://127.0.0.1:8000**

API docs: **http://127.0.0.1:8000/docs**

### 4. Frontend setup

Open a **new terminal**:

```bash
cd Frontend

# Install dependencies
npm install

# Optional: copy env template
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173** (or the next available port)

Production build:

```bash
npm run build
npm run preview
```

---

## Running the App

You need **two terminals** running at the same time:

| Terminal | Command | URL |
|----------|---------|-----|
| Backend | `cd Backend && python -m uvicorn main:app --reload` | http://127.0.0.1:8000 |
| Frontend | `cd Frontend && npm run dev` | http://localhost:5173 |

Then open the frontend URL in your browser.

---

## Usage

### Student Chat
1. Go to **http://localhost:5173**
2. Click **Ask void.ai** or navigate to `/chat`
3. Type a question, e.g. *"Who is the HOD of AIML?"* or *"Show recent notices"*
4. View answers with expandable context metadata
5. Check past chats at `/history`

### Admin Panel
1. Go to **/admin/login**
2. Sign in with the admin credentials you created during setup
3. Add college data (departments, courses, faculty, etc.)
4. Click **Rebuild Index** after adding new records
5. Use **View Data** to browse tables

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/query` | RAG query — send `{ "question": "...", "top_k": 3 }` |
| `POST` | `/api/conversation/save` | Save a chat exchange |
| `GET` | `/api/conversation/history` | Get past conversations |
| `POST` | `/api/admin/login` | Admin login |
| `POST` | `/api/admin/add/department` | Add department |
| `POST` | `/api/admin/add/course` | Add course |
| `POST` | `/api/admin/add/faculty` | Add faculty |
| `POST` | `/api/admin/add/fee` | Add fee record |
| `POST` | `/api/admin/add/notice` | Add notice |
| `POST` | `/api/admin/add/student` | Add student |
| `GET` | `/api/admin/data/{table_name}` | View table data |
| `POST` | `/api/admin/rebuild-index` | Rebuild FAISS index |
| `GET` | `/api/health` | Health check |

Allowed tables for `GET /api/admin/data/{table_name}`:
`departments`, `courses`, `faculty`, `fees`, `notices`, `students`, `audit_logs`

---

## How RAG Works

```
Student Question
      ↓
Embed question (Sentence Transformers)
      ↓
Search FAISS index for top-k similar chunks
      ↓
Send question + retrieved context to Groq (Llama 3)
      ↓
Return AI answer to frontend
      ↓
Save conversation to PostgreSQL
```

1. College data is stored in **PostgreSQL**
2. On index build, records are converted to text chunks and embedded
3. Embeddings are stored in a **FAISS** vector index
4. When a student asks a question, similar chunks are retrieved
5. Retrieved context + question is sent to **Groq LLM** for the final answer

---

## Frontend Routes

| Route | Page |
|-------|------|
| `/` | Landing page |
| `/chat` | Student chatbot |
| `/history` | Conversation history |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin panel |

---

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify `.env` credentials are correct
- Run `python database/db_connect.py` to test the connection

### Chat returns "No relevant data found"
- Add data via the Admin Dashboard
- Click **Rebuild Index** after adding records
- Or run: `python embeddings/faiss_store.py`

### Groq / AI errors
- Confirm `GROQ_API_KEY` is set in `Backend/.env`
- Check your Groq API quota at [console.groq.com](https://console.groq.com)

### Frontend can't reach backend
- Ensure backend is running on port `8000`
- Check `Frontend/src/api/axios.js` — base URL should be `http://127.0.0.1:8000`
- CORS is enabled on the backend for all origins

### First run is slow
- Sentence Transformers downloads the embedding model (~90 MB) on first use
- This is normal and only happens once

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `college_rag` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | — | Database password |
| `GROQ_API_KEY` | — | Groq API key (required) |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | LLM model name |
| `ADMIN_SECRET_KEY` | — | Secret for signing admin login tokens (required) |
| `ADMIN_USERNAME` | `admin` | Username for one-time admin creation script |
| `ADMIN_PASSWORD` | — | Password for one-time admin creation script |
| `CORS_ORIGINS` | localhost dev URLs | Comma-separated allowed frontend origins |

---

## Security (before pushing to GitHub)

**Do not commit:**
- `Backend/.env` — contains DB password, Groq API key, admin secret
- `Frontend/.env` — optional local overrides
- `Backend/embeddings/faiss.index` and `metadata.json` — generated from your DB (may contain real college data)

**Already protected:**
- Admin API routes require a Bearer token from `/api/admin/login`
- Unprotected public `/api/rebuild-index` endpoint removed (use admin route instead)
- CORS restricted to configured origins (not `*`)
- Default credentials removed from the login form

**Before your first push, verify:**
```bash
git status                    # no .env files listed
git check-ignore Backend/.env Backend/embeddings/faiss.index
```

If you ever committed secrets by mistake, rotate your Groq API key and DB password immediately.

---

## License

This project is for educational / college use.

---

## Author

Built as a **College RAG System** mini project — **void.ai** 🎓
