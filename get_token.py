import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def register_and_login():
    email = f"tenant_{sys.version_info.major}@example.com" # simple randomizer
    import random
    email = f"tenant_{random.randint(1000,9999)}@example.com"
    
    password = "password123"
    
    # 1. Register
    reg_data = {
        "email": email,
        "password": password,
        "name": "Test Tenant",
        "role": "tenant"
    }
    
    print(f"Registering {email}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
        if resp.status_code != 200:
            print(f"Registration failed: {resp.text}")
            # Try login if already exists
            pass 
        else:
            print("Registration success.")
    except Exception as e:
        print(f"Connection failed: {e}")
        return

    # 2. Login
    login_data = {
        "email": email,
        "password": password
    }
    
    print(f"Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if resp.status_code == 200:
        token = resp.json()["access_token"]
        print(f"TOKEN: {token}")
    else:
        print(f"Login failed: {resp.text}")

if __name__ == "__main__":
    register_and_login()
