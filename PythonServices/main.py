from fastapi import FastAPI
import pyodbc

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to Python Services!"}

def get_connection(database_name):
    conn = pyodbc.connect(
        f'DRIVER={{ODBC Driver 18 for SQL Server}};'
        f'SERVER=localhost;'
        f'DATABASE={database_name};'
        f'Trusted_Connection=yes;'
        f'TrustServerCertificate=yes;'
    )
    return conn

@app.get("/students")
def get_students():
    try:
        conn = get_connection("StudentDB")
        cursor = conn.cursor()
        cursor.execute("SELECT name, email FROM Students")
        results = [{"name": row[0], "email": row[1]} for row in cursor.fetchall()]
        return results
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()

@app.get("/courses")
def get_courses():
    try:
        conn = get_connection("CourseDB")
        cursor = conn.cursor()
        cursor.execute("SELECT Title,Description,Duration,Instructor FROM Courses")
        results = [{"Title": row[0],"Description": row[1], "Duration": row[2],"instructor": row[3]} for row in cursor.fetchall()]
        return results
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()
