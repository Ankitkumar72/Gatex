import requests
import json
import sys
import random

BASE_URL = "http://127.0.0.1:8001"

def get_token():
    email = f"tenant_slang_{random.randint(10000,99999)}@test.com"
    password = "password123"
    reg_data = {"email": email,"password": password,"name": "Test Tenant","role": "tenant"}
    try:
        requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    except: pass
    resp = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    if resp.status_code == 200: return resp.json()["access_token"]
    return None

if __name__ == "__main__":
    token = get_token()
    message = "My sparky friend said the main breaker is dodgy."
    print(f"--- Testing: '{message}' ---")
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.post(f"{BASE_URL}/agent/chat", json={"message": message}, headers=headers)
    result = resp.json()
    print(f"Response: {result.get('message')}")
    final = result.get('final_state', {})
    print(f"Category: {final.get('maintenance_category')}")
    print(f"Urgency: {final.get('urgency_score')}")
    print(f"Classification: {final.get('classification')}")
