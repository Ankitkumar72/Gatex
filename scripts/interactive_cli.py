import sys
import os
import uuid
import sqlite3

# Add root project to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from langchain_core.messages import HumanMessage
from src.graph import app

def run_interactive_session():
    print("--- PropFlow Interactive CLI ---")
    print("Type 'exit' or 'quit' to stop.")
    print("Type 'approve' to simulate Human Approval when prompted.")
    
    # Generate a unique thread ID for this session
    thread_id = f"interactive-{uuid.uuid4().hex[:6]}"
    config = {"configurable": {"thread_id": thread_id}}
    
    # Set dummy key for demo if not present
    if "OPENAI_API_KEY" not in os.environ:
        os.environ["OPENAI_API_KEY"] = "sk-dummy-key"
        print("(Using dummy OpenAI Key for mock mode)")

    print(f"\nSession ID: {thread_id}")

    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            break
            
        # Check if we are in a suspended state (waiting for approval)
        state_snapshot = app.get_state(config)
        if state_snapshot.next == ('dispatch',) and user_input.lower() == "approve":
            print("\n[System] Human Approval Received. Resuming...")
            inputs = None # Resume
        elif state_snapshot.next == ('dispatch',):
             print("\n[System] Workflow is paused waiting for approval. Type 'approve' to proceed, or anything else to ignore.")
             continue
        else:
            # Normal conversation
            inputs = {"messages": [HumanMessage(content=user_input)], "request_id": thread_id}

        # Stream the response
        try:
            for event in app.stream(inputs, config=config):
                for node_name, content in event.items():
                    # print(f"[{node_name}]") # Debug clutter
                    if "messages" in content:
                        last_msg = content["messages"][-1]
                        print(f"Bot: {last_msg.content}")
                    if "draft_work_order" in content:
                        print(f"\n--- DRAFT WORK ORDER ---\n{content['draft_work_order']}\n------------------------")
        except Exception as e:
            print(f"Error: {e}")
            
        # Check status after turn
        state_snapshot = app.get_state(config)
        if state_snapshot.next == ('dispatch',):
            print("\n[!] APPROVAL REQUIRED: Workflow paused. Type 'approve' to authorize dispatch.")

if __name__ == "__main__":
    run_interactive_session()
