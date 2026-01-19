
import os
import sys
import uuid
# Add root project to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from langchain_core.messages import HumanMessage
from src.graph import app

def test_continuation():
    thread_id = f"test-{uuid.uuid4().hex[:6]}"
    config = {"configurable": {"thread_id": thread_id}}
    
    print(f"--- Turn 1: Routine Issue (Should end at DIY Guide) ---")
    inputs = {"messages": [HumanMessage(content="My kitchen sink is leaking")]}
    output_1 = list(app.stream(inputs, config=config))
    print(f"Turn 1 Events: {len(output_1)}")
    
    # Check state
    state_1 = app.get_state(config)
    print(f"State after Turn 1: Next={state_1.next}")
    
    print(f"\n--- Turn 2: Follow up (Should trigger Triage again?) ---")
    inputs_2 = {"messages": [HumanMessage(content="That did not help. It is flooding now.")]}
    output_2 = list(app.stream(inputs_2, config=config))
    print(f"Turn 2 Events: {len(output_2)}")
    
    state_2 = app.get_state(config)
    print(f"State after Turn 2: Next={state_2.next}")

if __name__ == "__main__":
    test_continuation()
