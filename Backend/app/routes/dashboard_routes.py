from fastapi import APIRouter
from app.database import users_collection

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_data():
    total_users = users_collection.count_documents({})

    return {
        "total_users": total_users,
        "total_content": 25,
        "total_interactions": 120
    }