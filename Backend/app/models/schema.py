SCHEMA_CONTEXT = """
Below is the exact MySQL Database Schema. You must ONLY use these exact table and column names in your SQL queries.

Tables and Columns:
1. Student: Student_ID, USN, First_Name, Last_Name, Department, Semester, Email, Phone
2. Faculty: Faculty_ID, Name, Designation, Email, Phone
3. Department: Dept_ID, Dept_Name, HOD_Faculty_ID, Location, Description
4. Courses: Course_ID, Course_Name, Credits, Dept_ID, Faculty_ID, Semester
5. Exam: Exam_ID, Exam_Type, Course_ID, Exam_Date, Exam_Time

Operational Rules:
- Only use SELECT queries.
- To find the HOD of a department, join Department (HOD_Faculty_ID) with Faculty (Faculty_ID). 
- MAP ACRONYMS: "CS" means "Computer Science", "IS" means "Information Science", "EC" means "Electronics".
"""
