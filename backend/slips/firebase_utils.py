import os
import json
import base64
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth

# Load environment variables from .env
load_dotenv()

# Get Firebase credentials from environment variable
firebase_json_base64 = os.getenv("FIREBASE_CREDENTIALS_JSON")

if not firebase_json_base64:
    raise ValueError("FIREBASE_CREDENTIALS_JSON environment variable is not set!")

# Decode the base64-encoded Firebase credentials JSON
try:
    firebase_json_str = base64.b64decode(firebase_json_base64).decode("utf-8")
    firebase_credentials = json.loads(firebase_json_str)
except Exception as e:
    raise ValueError(f"Failed to decode Firebase credentials: {str(e)}")

# Initialize Firebase with decoded credentials
cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred)

def fetch_firebase_users():
    """Fetch users from Firebase Authentication"""
    users = []
    try:
        page = auth.list_users()
        while page:
            for user in page.users:
                users.append({'uid': user.uid, 'email': user.email})
            page = page.get_next_page()
    except Exception as e:
        print(f"Error fetching Firebase users: {str(e)}")
    return users
