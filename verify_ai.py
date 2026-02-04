import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8001"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlY2VkMjBlMC04ZWNkLTRhMjMtYjE5NS1lMjQ0MTQ1NzFjYWEiLCJlbWFpbCI6InRlbmFudF8zNTc0QGV4YW1wbGUuY29tIiwicm9sZSI6InRlbmFudCIsIm5hbWUiOiJUZXN0IFRlbmFudCIsImV4cCI6MTc3MDE5OTYzMiwidHlwZSI6ImFjY2VzcyJ9.bEvbS0yQl0g-UF2nNLld-uz2mhTeN3kdoYe9Q1nLXew"

def test_chat(message):
    print(f"\n--- Testing: '{message}' ---")
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }
    data = {"message": message}
    
    try:
        resp = requests.post(f"{BASE_URL}/agent/chat", json=data, headers=headers)
        if resp.status_code == 200:
            result = resp.json()
            print(f"Status: {result.get('status')}")
            print(f"AI Response: {result.get('message')}")
            print(f"Final State (snippet): {str(result.get('final_state', {}).get('classification'))}")
        else:
            print(f"Error: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_chat("It's broken")
    test_chat("The loo is busted")
