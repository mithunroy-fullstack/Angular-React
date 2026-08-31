import pandas as pd

from PythonServices.reporting_service.app.services.attendance_service import calculate_attendance_rate


def test_calculate_attendance_rate_groups_students_and_rounds_results():
    attendance = pd.DataFrame(
        [
            {"StudentId": 1, "Name": "Ada", "Status": "Present"},
            {"StudentId": 1, "Name": "Ada", "Status": "Absent"},
            {"StudentId": 2, "Name": "Grace", "Status": "Present"},
            {"StudentId": 2, "Name": "Grace", "Status": "Present"},
            {"StudentId": 2, "Name": "Grace", "Status": "Absent"},
        ]
    )

    result = calculate_attendance_rate(attendance)

    assert result.to_dict(orient="records") == [
        {"StudentId": 1, "Name": "Ada", "attendance_rate": 50.0},
        {"StudentId": 2, "Name": "Grace", "attendance_rate": 66.67},
    ]


def test_calculate_attendance_rate_accepts_normalized_student_columns():
    attendance = pd.DataFrame(
        [
            {"studentId": 1, "name": "Ada", "status": "Present"},
            {"studentId": 1, "name": "Ada", "status": "Absent"},
            {"studentId": 2, "name": "Grace", "status": "present"},
            {"studentId": 2, "name": "Grace", "status": "present"},
            {"studentId": 2, "name": "Grace", "status": "absent"},
        ]
    )

    result = calculate_attendance_rate(attendance)

    assert result.to_dict(orient="records") == [
        {"studentId": 1, "name": "Ada", "attendance_rate": 50.0},
        {"studentId": 2, "name": "Grace", "attendance_rate": 66.67},
    ]
