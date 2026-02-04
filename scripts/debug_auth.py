import sys
import os
from passlib.context import CryptContext

try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    print("Context created.")
    
    password = "password"
    print(f"Hashing '{password}'...")
    hashed = pwd_context.hash(password)
    print(f"Success: {hashed}")
    
    print("Verifying...")
    valid = pwd_context.verify(password, hashed)
    print(f"Valid: {valid}")

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
