import sys
import os
import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver

# Add root project to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from langchain_core.messages import HumanMessage
from src.graph import app

def verify_persistence():
    print("--- 1. Starting Initial Request (Process A) ---")
    thread_id = "persistence-test-01"
    config = {"configurable": {"thread_id": thread_id}}
    
    # Send initial request
    print(f"Input: 'I need a plumber for a leak.' (Thread: {thread_id})")
    inputs = {"messages": [HumanMessage(content="I need a plumber for a leak.")], "request_id": thread_id}
    
    # Run until interrupt
    # We expect it to stop at 'human_approval'
    for event in app.stream(inputs, config=config):
        for node_name, content in event.items():
            print(f"[{node_name}] Executed")
    
    snapshot = app.get_state(config)
    print(f"\nSnapshot at Break: Next Node -> {snapshot.next}")
    
    if snapshot.next == ('dispatch',):
        print("SUCCESS: Graph correctly paused at 'dispatch' (waiting for approval).")
    else:
        print(f"FAILURE: Graph did not pause where expected. Next: {snapshot.next}")
        return

    print("\n--- 3. Resuming Workflow ---")
    # Resume with approval
    # We pass None as input to resume from the suspended state
    print("Resuming with 'Command: Continue'...")
    
    for event in app.stream(None, config=config):
        for node_name, content in event.items():
            print(f"[{node_name}] Executed (Resumed)")
            if 'messages' in content:
                print(f"   => {content['messages'][-1].content}")

    print("\n--- Verification Complete ---")

if __name__ == "__main__":
    import uuid
    # Use unique DB for this run
    test_db = f"test_{uuid.uuid4().hex[:8]}.db"
    os.environ["DB_PATH"] = test_db
    # Set dummy API key to bypass client validation errors
    os.environ["OPENAI_API_KEY"] = "sk-dummy-key-for-testing-only"
    
    try:
        verify_persistence()
    finally:
        # Cleanup
        # Note: The 'app' global in graph.py opens the connection at import time. 
        # So we might not be able to delete it here if the process holds the lock.
        # But keeping unique names prevents collision.
        pass
