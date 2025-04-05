from fastapi import FastAPI
from auth import auth_router

app = FastAPI()

# Include authentication routes
app.include_router(auth_router, prefix="/auth")

# Root endpoint
@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}
