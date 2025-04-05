import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    GOOGLE_VISION_API_KEY = os.getenv("GOOGLE_VISION_API_KEY")
