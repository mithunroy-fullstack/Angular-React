import pyodbc
import pandas as pd

def get_attendance_from_db():
    try:
        conn = pyodbc.connect(
            'DRIVER={ODBC Driver 18 for SQL Server};'
            'SERVER=host.docker.internal,1434;'
            'DATABASE=StudentDB;'
            'UID=python_user;'             # <--- Change 1: Add your SQL Username
            'PWD=Py@12345;'    # <--- Change 2: Add your SQL Password
            'Encrypt=yes;'                 # Required for ODBC Driver 18
            'TrustServerCertificate=yes;'
        )
        query = "Select a.StudentId,s.Name,a.Status,a.AttendanceDate from [StudentDB].[dbo].[Students] s inner join [StudentDB].[dbo].[Attendance] a on s.Id=a.StudentId"
        df = pd.read_sql(query, conn)
        conn.close()
        return df
    except Exception as e:
        print("Database connection error:", e)
        raise


def calculate_attendance_rate(df):
    # Group by both StudentId and Name so Name is preserved in the output
    summary = df.groupby(["StudentId", "Name"])["Status"].apply(
        lambda x: ((x == "Present").mean() * 100)
    ).reset_index(name="attendance_rate")
    
    # Clean up long floating points to 2 decimal places
    summary["attendance_rate"] = summary["attendance_rate"].round(2)
    return summary

