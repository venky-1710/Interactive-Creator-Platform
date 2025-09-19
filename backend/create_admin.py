#!/usr/bin/env python3
"""
Create Admin User Script
Run this script to create an admin user for testing the admin functionality.
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://venky:venky8086@e-commerce-cluster.xbgmy.mongodb.net/")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.createathon

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin_user():
    """Create an admin user"""
    username = input("Enter admin username: ").strip()
    email = input("Enter admin email: ").strip()
    password = input("Enter admin password: ").strip()
    full_name = input("Enter admin full name (optional): ").strip()
    
    if not username or not email or not password:
        print("Error: Username, email, and password are required!")
        return
    
    # Check if user already exists
    existing_user = await db.users.find_one({"$or": [{"username": username}, {"email": email}]})
    if existing_user:
        print("Error: User with this username or email already exists!")
        return
    
    # Create admin user
    admin_user = {
        "username": username,
        "email": email,
        "full_name": full_name if full_name else None,
        "role": "admin",
        "hashed_password": pwd_context.hash(password),
        "created_at": datetime.utcnow(),
        "completed_challenges": [],
        "points": 0,
        "is_active": True
    }
    
    try:
        result = await db.users.insert_one(admin_user)
        print(f"✅ Admin user created successfully!")
        print(f"   Username: {username}")
        print(f"   Email: {email}")
        print(f"   Role: admin")
        print(f"   User ID: {result.inserted_id}")
        print("\nYou can now login with these credentials to access the admin dashboard.")
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")

async def list_admin_users():
    """List all admin users"""
    admin_users = await db.users.find({"role": "admin"}).to_list(100)
    
    if not admin_users:
        print("No admin users found.")
        return
    
    print(f"\n📋 Found {len(admin_users)} admin user(s):")
    print("-" * 60)
    for user in admin_users:
        print(f"Username: {user['username']}")
        print(f"Email: {user['email']}")
        print(f"Full Name: {user.get('full_name', 'N/A')}")
        print(f"Active: {user['is_active']}")
        print(f"Created: {user['created_at'].strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 60)

async def main():
    print("🔧 Admin User Management Tool")
    print("1. Create new admin user")
    print("2. List existing admin users")
    print("3. Exit")
    
    choice = input("\nSelect an option (1-3): ").strip()
    
    if choice == "1":
        await create_admin_user()
    elif choice == "2":
        await list_admin_users()
    elif choice == "3":
        print("Goodbye!")
        return
    else:
        print("Invalid choice. Please select 1, 2, or 3.")

if __name__ == "__main__":
    asyncio.run(main())
