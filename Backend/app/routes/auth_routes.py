from fastapi import APIRouter, HTTPException
from app.database import users_collection
from app.models.user_model import UserCreate, UserLogin, GoogleToken
from app.services.auth_services import create_access_token
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter()

GOOGLE_CLIENT_ID = "256986324217-a7f33trfiagbgttvnm7pd3j6v1t3ij5u.apps.googleusercontent.com"


@router.post("/register")
def register(user: UserCreate):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    users_collection.insert_one(user.dict())
    return {"message": "User registered successfully"}


@router.post("/login")
def login(user: UserLogin):
    existing_user = users_collection.find_one(
        {"email": user.email, "password": user.password}
    )

    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"email": user.email})

    return {"access_token": token, "name": existing_user.get("name")}


@router.post("/google-login")
def google_login(data: GoogleToken):
    try:
        idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            GOOGLE_CLIENT_ID,
        )

        email = idinfo["email"]
        name = idinfo["name"]

        user = users_collection.find_one({"email": email})

        if not user:
            users_collection.insert_one({
                "name": name,
                "email": email,
                "google_auth": True
            })

        token = create_access_token({"email": email})

        return {"access_token": token, "name": name, "email": email}

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")