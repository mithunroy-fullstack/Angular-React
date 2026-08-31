from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.report_router import router

app = FastAPI(title="Reporting Service", version="1.0.0")

# Define the origins that are allowed to make cross-origin requests
origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add the CORS middleware to handle headers and preflight checks automatically
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your existing reporting router
app.include_router(router, prefix="/api/reports")

@app.get("/")
def root():
    return {"message": "Reporting Service is running"}
