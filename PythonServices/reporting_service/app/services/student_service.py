import httpx
import pandas as pd
import os

STUDENT_SERVICE_URL = os.getenv(
    "STUDENT_SERVICE_URL",
    "http://student-api-service.staging.svc.cluster.local",
)

async def get_performance_from_service(token: str):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{STUDENT_SERVICE_URL}/api/performance",
            headers=headers
        )
        response.raise_for_status()
        data = response.json()
        return pd.DataFrame(data)
