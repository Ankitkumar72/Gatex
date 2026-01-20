import requests
import uuid
import time

BASE_URL = "http://127.0.0.1:8000"

def test_chat():
    thread_id = f"test-{uuid.uuid4().hex[:6]}"
    print(f"--- Testing Chat (Thread: {thread_id}) ---")
    
    # 1. Routine Request (should complete or go to Clarify)
    print("Sending: 'The lightbulb is broken'")
    resp = requests.post(f"{BASE_URL}/agent/chat", json={
        "message": "The lightbulb is broken",
        "thread_id": thread_id
    })
    data = resp.json()
    print(f"Status: {data['status']}")
    print(f"Response: {data['response']}")
    
    # 2. Vendor Request (should go to Approval)
    thread_id_2 = f"test-{uuid.uuid4().hex[:6]}"
    print(f"\n--- Testing Approval Flow (Thread: {thread_id_2}) ---")
    print("Sending: 'Leaky faucet'")
    resp = requests.post(f"{BASE_URL}/agent/chat", json={
        "message": "I have a leaky faucet",
        "thread_id": thread_id_2
    })
    data = resp.json()
    print(f"Status: {data['status']}")
    print(f"Response: {data['response']}")
    
    if data['status'] == "waiting_for_approval":
        print(">> Approving...")
        resp = requests.post(f"{BASE_URL}/agent/approve", json={
            "thread_id": thread_id_2,
            "action": "approve"
        })
        data = resp.json()
        print(f"Status: {data['status']}")
        print(f"Response: {data['response']}")

if __name__ == "__main__":
    try:
        test_chat()
    except Exception as e:
        print(f"Error: {e}")
