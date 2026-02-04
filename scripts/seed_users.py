import sys
import os
import uuid

# Add root project to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.database import init_db, get_db, UserDB
from backend.auth import hash_password, UserRole

def seed_users():
    print("Seeding users...")
    init_db()
    
    db = next(get_db())
    
    users = [
        {
            "email": "tenant@example.com",
            "password": "password",
            "name": "Alex Morgan",
            "role": UserRole.TENANT
        },
        {
            "email": "manager@example.com",
            "password": "password",
            "name": "Sarah Connor",
            "role": UserRole.MANAGER
        },
        {
            "email": "tech@example.com",
            "password": "password",
            "name": "John Doe",
            "role": UserRole.TECHNICIAN
        }
    ]
    
    for u in users:
        existing = db.query(UserDB).filter(UserDB.email == u["email"]).first()
        if not existing:
            new_user = UserDB(
                id=str(uuid.uuid4()),
                email=u["email"],
                hashed_password=hash_password(u["password"]),
                name=u["name"],
                role=u["role"]
            )
            db.add(new_user)
            print(f"Created user: {u['email']}")
        else:
            print(f"User exists: {u['email']}")
            
    db.commit()
    print("Seeding complete.")

if __name__ == "__main__":
    seed_users()
