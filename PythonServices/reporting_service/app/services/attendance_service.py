import pyodbc
import pandas as pd
import os
import re

def get_attendance_from_db():
    try:
        connection_string = os.getenv("DB_CONNECTION_STRING")
        if not connection_string:
            connection_string = (
                "SERVER=host.docker.internal,1434;"
                "DATABASE=StudentDB;"
                "UID=python_user;"
                "PWD=Py@12345;"
                "Encrypt=yes;"
                "TrustServerCertificate=yes;"
            )

        connection_string = re.sub(r"Encrypt=True", "Encrypt=yes", connection_string, flags=re.IGNORECASE)
        connection_string = re.sub(
            r"TrustServerCertificate=False",
            "TrustServerCertificate=no",
            connection_string,
            flags=re.IGNORECASE,
        )
        connection_string = re.sub(r"User ID=", "UID=", connection_string, flags=re.IGNORECASE)
        connection_string = re.sub(r"Initial Catalog=", "DATABASE=", connection_string, flags=re.IGNORECASE)

        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 18 for SQL Server};" + connection_string
        )
        query = "Select a.StudentId,s.Name,a.Status,a.AttendanceDate from [dbo].[Students] s inner join [dbo].[Attendance] a on s.Id=a.StudentId"
        df = pd.read_sql(query, conn)
        conn.close()
        return df
    except Exception as e:
        print("Database connection error:", e)
        raise


def calculate_attendance_rate(df):
    if df is None or df.empty:
        return pd.DataFrame(columns=["StudentId", "Name", "attendance_rate"])

    student_key = next(
        (col for col in df.columns if str(col).strip().lower() in {"studentid", "student_id"}),
        None,
    )
    name_key = next(
        (col for col in df.columns if str(col).strip().lower() in {"name", "studentname"}),
        None,
    )
    status_key = next(
        (col for col in df.columns if str(col).strip().lower() in {"status", "attendance_status"}),
        None,
    )

    if not student_key or not name_key or not status_key:
        raise ValueError(
            "Attendance data must include student identifier, name, and status columns. "
            f"Available columns: {list(df.columns)}"
        )

    normalized_df = df[[student_key, name_key, status_key]].copy()
    normalized_df.columns = ["student_id", "name", "status"]
    normalized_df["status"] = normalized_df["status"].astype(str).str.strip().str.lower()

    summary = normalized_df.groupby(["student_id", "name"])["status"].apply(
        lambda x: ((x == "present").mean() * 100)
    ).reset_index(name="attendance_rate")

    summary["attendance_rate"] = summary["attendance_rate"].round(2)
    summary = summary.rename(columns={"student_id": student_key, "name": name_key})
    return summary

