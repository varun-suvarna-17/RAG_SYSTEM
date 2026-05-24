import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

def init_db():
    try:
        conn = pymysql.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "")
        )
        cursor = conn.cursor()
        
        db_name = os.getenv("DB_NAME", "college_rag")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        cursor.execute(f"USE {db_name}")

        # Create Tables
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Student (
            Student_ID INT PRIMARY KEY AUTO_INCREMENT,
            USN VARCHAR(20) UNIQUE,
            First_Name VARCHAR(50),
            Last_Name VARCHAR(50),
            Department VARCHAR(50),
            Semester INT,
            Email VARCHAR(100),
            Phone VARCHAR(15)
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Faculty (
            Faculty_ID INT PRIMARY KEY AUTO_INCREMENT,
            Name VARCHAR(100),
            Designation VARCHAR(100),
            Email VARCHAR(100),
            Phone VARCHAR(15)
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Department (
            Dept_ID INT PRIMARY KEY AUTO_INCREMENT,
            Dept_Name VARCHAR(100),
            HOD_Faculty_ID INT,
            Location VARCHAR(100),
            Description TEXT,
            FOREIGN KEY (HOD_Faculty_ID) REFERENCES Faculty(Faculty_ID)
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Courses (
            Course_ID INT PRIMARY KEY AUTO_INCREMENT,
            Course_Name VARCHAR(100),
            Credits INT,
            Dept_ID INT,
            Faculty_ID INT,
            Semester INT,
            FOREIGN KEY (Dept_ID) REFERENCES Department(Dept_ID),
            FOREIGN KEY (Faculty_ID) REFERENCES Faculty(Faculty_ID)
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Exam (
            Exam_ID INT PRIMARY KEY AUTO_INCREMENT,
            Exam_Type VARCHAR(50),
            Course_ID INT,
            Exam_Date DATE,
            Exam_Time TIME,
            FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID)
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Query_log (
            Query_ID INT PRIMARY KEY AUTO_INCREMENT,
            Student_ID INT,
            Response_time FLOAT,
            Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        print(f"Database '{db_name}' initialized successfully with PyMySQL!")
        conn.commit()
    except pymysql.MySQLError as e:
        print(f"Error initializing database: {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    init_db()
