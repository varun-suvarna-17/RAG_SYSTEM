import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

def seed_db():
    try:
        conn = pymysql.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "college_rag")
        )
        cursor = conn.cursor()

        # 1. Seed Faculty
        faculty_data = [
            ("Dr. Ananth Rao", "Professor & HOD", "ananth.cs@sahyadri.edu.in", "9876543210"),
            ("Dr. Smitha J", "Assistant Professor", "smitha.is@sahyadri.edu.in", "9876543211"),
            ("Prof. Rajesh Kumar", "Assistant Professor", "rajesh.ec@sahyadri.edu.in", "9876543212")
        ]
        cursor.executemany("INSERT IGNORE INTO Faculty (Name, Designation, Email, Phone) VALUES (%s, %s, %s, %s)", faculty_data)
        
        # 2. Seed Departments (Link HODs)
        cursor.execute("SELECT Faculty_ID FROM Faculty WHERE Name = 'Dr. Ananth Rao'")
        hod_cs_id = cursor.fetchone()[0]
        
        dept_data = [
            ("Computer Science", hod_cs_id, "Block A, 2nd Floor", "Department of Computer Science & Engineering"),
            ("Information Science", 2, "Block B, 1st Floor", "Department of Information Science"),
            ("Electronics", 3, "Block A, ground Floor", "Department of Electronics & Communication")
        ]
        cursor.executemany("INSERT IGNORE INTO Department (Dept_Name, HOD_Faculty_ID, Location, Description) VALUES (%s, %s, %s, %s)", dept_data)

        # 3. Seed Students
        student_data = [
            ("4SF21CS001", "John", "Doe", "Computer Science", 5, "john@gmail.com", "8887776665"),
            ("4SF21IS045", "Jane", "Smith", "Information Science", 3, "jane@gmail.com", "8887776664"),
        ]
        cursor.executemany("INSERT IGNORE INTO Student (USN, First_Name, Last_Name, Department, Semester, Email, Phone) VALUES (%s, %s, %s, %s, %s, %s, %s)", student_data)

        # 4. Seed Courses
        course_data = [
            ("Database Management Systems", 4, 1, hod_cs_id, 5),
            ("Artificial Intelligence", 4, 1, hod_cs_id, 7),
        ]
        cursor.executemany("INSERT INTO Courses (Course_Name, Credits, Dept_ID, Faculty_ID, Semester) VALUES (%s, %s, %s, %s, %s)", course_data)

        print("Database seeded with sample data successfully!")
        conn.commit()
    except pymysql.MySQLError as e:
        print(f"Error seeding database: {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    seed_db()
