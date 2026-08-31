from fastapi import APIRouter, Header, HTTPException
from app.services.attendance_service import get_attendance_from_db, calculate_attendance_rate
from app.services.student_service import get_performance_from_service
from sklearn.linear_model import LinearRegression
import pandas as pd
import traceback

router = APIRouter()

@router.get("/attendance-trends")
def attendance_trends():
    df = get_attendance_from_db()
    summary = calculate_attendance_rate(df)
    return {"attendanceSummary": summary.to_dict(orient="records")}



@router.get("/performance-predictions")
async def performance_predictions(
    authorization: str = Header(None), 
    token_param: str = None
):
    token = authorization.replace("Bearer ", "", 1) if authorization and authorization.startswith("Bearer ") else token_param

    if not token:
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    try:
        attendance_df = get_attendance_from_db()
        attendance_summary = calculate_attendance_rate(attendance_df)
        performance_df = await get_performance_from_service(token)

        # -----------------------------------------------------------------
        # FORCE BOTH DATAFRAMES TO USE THE SAME EXACT JOIN KEY ("student_id")
        # -----------------------------------------------------------------
        # Standardize Left DataFrame (Attendance)
        if "StudentId" in attendance_summary.columns:
            attendance_summary = attendance_summary.rename(columns={"StudentId": "student_id"})
        elif "studentId" in attendance_summary.columns:
            attendance_summary = attendance_summary.rename(columns={"studentId": "student_id"})

        # Standardize Right DataFrame (Performance from .NET API)
        if "StudentId" in performance_df.columns:
            performance_df = performance_df.rename(columns={"StudentId": "student_id"})
        elif "studentId" in performance_df.columns:
            performance_df = performance_df.rename(columns={"studentId": "student_id"})

        # Debug Check: Fail gracefully if neither table contains an identifier
        if "student_id" not in attendance_summary.columns or "student_id" not in performance_df.columns:
            return {
                "error": "Key mismatch",
                "attendance_columns": list(attendance_summary.columns),
                "performance_columns": list(performance_df.columns)
            }
        # -----------------------------------------------------------------

        # Perform the merge safely using the standardized key
        merged_df = pd.merge(attendance_summary, performance_df, on="student_id", how="inner")

        if merged_df.empty:
            return {"error": "Merge failed. No overlapping student IDs found between services."}

        # Handle Score column casing safely
        score_col = "score" if "score" in merged_df.columns else "Score"
        if score_col not in merged_df.columns:
            return {"error": f"Score column missing. Available: {list(merged_df.columns)}"}

        X = merged_df[["attendance_rate"]]
        y = merged_df[score_col]

        model = LinearRegression()
        model.fit(X, y)
        merged_df["predicted_score"] = model.predict(X)

        return {"predictions": merged_df.to_dict(orient="records")}

    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}
