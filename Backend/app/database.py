import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client["GraphRecAI"]

users_collection = db["users"]
content_collection = db["content"]
interactions_collection = db["interactions"]