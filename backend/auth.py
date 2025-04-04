import os
from fastapi import APIRouter, Depends, HTTPException, Header
from dotenv import load_dotenv
from db import get_collection
from datetime import datetime

# Load environment variables
load_dotenv()
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

auth_router = APIRouter()

# Function to verify Clerk authentication token
def verify_clerk(token: str = Header(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Missing Authorization Token")

    # Simulate token verification (replace with actual Clerk API call)
    if token != CLERK_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {"user_id": "12345", "email": "user@example.com"}  # Mock user data

# API Route to check if user is logged in
@auth_router.get("/check-login")
def check_login(user=Depends(verify_clerk)):
    # Save login data to MongoDB
    collection = get_collection("logins")
    login_data = {
        "user_id": user["user_id"],
        "email": user["email"],
        "login_time": datetime.utcnow(),
    }
    collection.insert_one(login_data)

    return {"message": "User authenticated and login data saved", "user": user}
