import requests
import json
import sys
import time
import random

BASE_URL = "http://127.0.0.1:8001"

def get_token():
    email = f"tenant_{random.randint(10000,99999)}@test.com"
    password = "password123"
    
    # 1. Register
    reg_data = {
        "email": email,
        "password": password,
        "name": "Test Tenant",
        "role": "tenant"
    }
    
    # print(f"Registering {email}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
        # If returns 400 (already registered), we try to login, but since it's random, likely success.
    except Exception as e:
        print(f"Auth Loop Error: {e}")
        return None

    # 2. Login
    login_data = {
        "email": email,
        "password": password
    }
    
    resp = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if resp.status_code == 200:
        return resp.json()["access_token"]
    else:
        print(f"Login failed: {resp.text}")
        return None

def test_chat(message, token):
    print(f"\n--- Testing: '{message}' ---")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {"message": message}
    
    try:
        resp = requests.post(f"{BASE_URL}/agent/chat", json=data, headers=headers)
        if resp.status_code == 200:
            result = resp.json()
            # print(f"Status: {result.get('status')}")
            print(f"AI Response : {result.get('message')}")
            final_state = result.get('final_state', {})
            classification = final_state.get('classification')
            urgency = final_state.get('urgency_score')
            print(f"Classification: {classification}")
            print(f"Urgency Score : {urgency}")
        else:
            print(f"Error: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    token = get_token()
    if not token:
        print("Failed to get auth token. Exiting.")
        sys.exit(1)
        
    # diverse test cases
    test_cases = [
        "My sparky friend said the main breaker is dodgy.", # Slang for electrician
        "Water is pouring through the ceiling light!", # Emergency
        "Can I paint my bedroom walls pink?", # Routine/General
        "The thingy in the kitchen is making a weird noise." # Vague -> Clarification needed
    ]
    
    for case in test_cases:
        test_chat(case, token)
        time.sleep(1) 
