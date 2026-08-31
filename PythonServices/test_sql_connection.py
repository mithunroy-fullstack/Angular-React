import pyodbc

def main():
    conn_student = pyodbc.connect(
        'DRIVER={ODBC Driver 18 for SQL Server};'
        'SERVER=localhost;'
        'DATABASE=StudentDB;'
        'Trusted_Connection=yes;'
        'TrustServerCertificate=yes;'
    )

    conn_course = pyodbc.connect(
        'DRIVER={ODBC Driver 18 for SQL Server};'
        'SERVER=localhost;'
        'DATABASE=CourseDB;'
        'Trusted_Connection=yes;'
        'TrustServerCertificate=yes;'
    )

    print("Connection successful!")

    cursor_student = conn_student.cursor()
    cursor_student.execute("SELECT TOP 5 * FROM Students")
    for row in cursor_student.fetchall():
        print("StudentDB:", row)

    cursor_course = conn_course.cursor()
    cursor_course.execute("SELECT TOP 5 * FROM Courses")
    for row in cursor_course.fetchall():
        print("CourseDB:", row)

    conn_student.close()
    conn_course.close()


if __name__ == "__main__":
    main()
