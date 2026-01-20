import sys
import os

# Add root project to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from langchain_core.messages import HumanMessage
from src.graph import app

def run_simulation(simulation_name, input_text, thread_id):
    print(f"\n--- Running Simulation: {simulation_name} ---")
    print(f"User Input: {input_text}")
    
    config = {"configurable": {"thread_id": thread_id}}
    
    # 1. Start the conversation
    inputs = {"messages": [HumanMessage(content=input_text)], "request_id": thread_id}
    
    # Run until interruption or finish
    result = None
    for event in app.stream(inputs, config=config):
        for node_name, node_content in event.items():
            print(f"[{node_name}] Processed")
            if "messages" in node_content:
                print(f"   => Message: {node_content['messages'][-1].content}")
            if "resolution_strategy" in node_content:
                print(f"   => Strategy: {node_content['resolution_strategy']}")
            if "draft_work_order" in node_content:
                print(f"   => Drafted Order: {node_content['draft_work_order']}")
                
    # Check current state to see if we are stopped at dispatched
    state_snapshot = app.get_state(config)
    print(f"Current State Next Node: {state_snapshot.next}")
    
    if state_snapshot.next == ('dispatch',):
        print(">>> HIDL TRIGGERED: Graph paused for Human Approval. <<<")
        # Simulating Approval
        print(">>> Simulation: Human Approves Dispatch. Resuming... <<<")
        # Resume
        for event in app.stream(None, config=config):
             for node_name, node_content in event.items():
                print(f"[{node_name}] Processed")
                if "messages" in node_content:
                    print(f"   => Message: {node_content['messages'][-1].content}")

    elif state_snapshot.next == ('wait_for_tenant',):
        print(">>> CLARIFICATION CYCLE: Graph paused for Tenant Input. <<<")
        print(">>> Simulation: Tenant replies 'The sink in the master bath'. Resuming... <<<")
        
        # Simulating Tenant Reply
        user_reply = "The sink in the master bath"
        inputs = {"messages": [HumanMessage(content=user_reply)]}
        # Note: In a real persistent graph, we would essentially be resuming or sending a new message to the existing thread.
        # Since 'wait_for_tenant' isn't technically an interrupt in LangGraph unless we explicitly set interrupt_before, 
        # but we DID set interrupt_before=["wait_for_tenant"].
        
        # So we resume by updating state with new input? Or just invoking stream with new input on same thread?
        # Standard pattern: app.update_state(config, {"messages": [HumanMessage(content=user_reply)]}, as_node="wait_for_tenant")
        # THEN resume with None.
        
        app.update_state(config, {"messages": [HumanMessage(content=user_reply)]}, as_node="wait_for_tenant")
        
        # Resume execution
        for event in app.stream(None, config=config):
              for node_name, node_content in event.items():
                print(f"[{node_name}] Processed")
                if "messages" in node_content:
                    print(f"   => Message: {node_content['messages'][-1].content}")
                if "resolution_strategy" in node_content:
                    print(f"   => Strategy: {node_content['resolution_strategy']}")

if __name__ == "__main__":
    # Case 1: Emergency (Fire)
    run_simulation("Emergency Triage", "Help! My kitchen is on fire!", "thread-1")
    
    # Case 2: DIY Policy (Lightbulb)
    run_simulation("DIY Guide", "The lightbulb in the hallway is broken.", "thread-2")
    
    # Case 3: Execution + Approval (Leaky Faucet)
    run_simulation("Vendor Dispatch", "I have a leaky faucet in the bathroom constantly dripping.", "thread-3")

    # Case 4: Clarification Needed
    run_simulation("Clarification Cycle", "It's broken and won't work.", "thread-4")
