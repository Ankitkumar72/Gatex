import requests
import sys

BASE_URL = "http://localhost:8000"

def test_login_and_chat():
    print("Testing Login...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "tenant@example.com",
            "password": "password"
        })
        
        if resp.status_code != 200:
            print(f"Login Failed: {resp.status_code} - {resp.text}")
            return
            
        data = resp.json()
        token = data["access_token"]
        print(f"Login Success. Token: {token[:10]}...")
        
        print("\nTesting Chat with Token...")
        headers = {"Authorization": f"Bearer {token}"}
        chat_resp = requests.post(f"{BASE_URL}/agent/chat", json={
            "message": "My AC is broken",
            "thread_id": "test-cli-thread"
        }, headers=headers)
        
        if chat_resp.status_code != 200:
            print(f"Chat Failed: {chat_resp.status_code} - {chat_resp.text}")
            return
            
        chat_data = chat_resp.json()
        print(f"Chat Success. Response: {chat_data['message']}")
        print(f"Status: {chat_data['status']}")
        
    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    test_login_and_chat()
