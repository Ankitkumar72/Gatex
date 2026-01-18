import sys
import os
import unittest
from unittest.mock import MagicMock, patch

# Add root project to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from langchain_core.messages import HumanMessage
from src.state import PropFlowState
# Import the graph app
from src.graph import app
from src.nodes.triage import TriageOutput

class TestPropFlowRealLLM(unittest.TestCase):
    
    @patch('src.nodes.triage.ChatGoogleGenerativeAI')
    @patch.dict(os.environ, {"GOOGLE_API_KEY": "AIza-test-key"}) # Valid-looking key for init
    def test_emergency_flow(self, mock_chat_gemini_class):
        print("\n--- Testing Emergency Flow with Mocked LLM ---")
        
        # 1. Setup the Mock
        # We need to mock the chain.invoke() return value
        mock_llm_instance = MagicMock()
        mock_structured_llm = MagicMock()
        
        # When .with_structured_output is called, return our mock structured llm
        mock_chat_gemini_class.return_value = mock_llm_instance
        mock_llm_instance.with_structured_output.return_value = mock_structured_llm
        
        # When chain.invoke is called, return a TriageOutput Pydantic object
        expected_output = TriageOutput(
            classification="emergency",
            urgency_score=10,
            maintenance_category="general",
            reasoning="Mocked LLM decided this is a fire."
        )
        mock_structured_llm.invoke.return_value = expected_output
        
        # 2. Run the Graph
        thread_id = "test-real-llm-01"
        config = {"configurable": {"thread_id": thread_id}}
        inputs = {"messages": [HumanMessage(content="My kitchen is on fire!")], "request_id": thread_id}
        
        # Run the graph
        final_state = None
        for event in app.stream(inputs, config=config):
            for node_name, content in event.items():
                print(f"[{node_name}] Processed")
                # Capture the final state implicitly/or explicitly
        
        # Get final state
        final_state = app.get_state(config)
        
        # 3. Assertions
        # Should have routed to 'human_escalation' (and then END)
        # Check classification in state
        self.assertEqual(final_state.values['classification'], "emergency")
        self.assertEqual(final_state.values['urgency_score'], 10)
        self.assertEqual(final_state.values['resolution_strategy'], "human_escalation")
        
        print("SUCCESS: Graph correctly handled the Mocked LLM 'Emergency' response.")

    @patch('src.nodes.triage.ChatGoogleGenerativeAI')
    @patch.dict(os.environ, {"GOOGLE_API_KEY": "AIza-test-key"})
    def test_routine_flow(self, mock_chat_gemini_class):
        print("\n--- Testing Routine Flow with Mocked LLM ---")
        
        # 1. Setup Mock for Routine
        mock_llm_instance = MagicMock()
        mock_structured_llm = MagicMock()
        mock_chat_gemini_class.return_value = mock_llm_instance
        mock_llm_instance.with_structured_output.return_value = mock_structured_llm
        
        expected_output = TriageOutput(
            classification="routine",
            urgency_score=3,
            maintenance_category="plumbing",
            reasoning="Mocked LLM decided this is a leaky faucet."
        )
        mock_structured_llm.invoke.return_value = expected_output
        
        # 2. Run Graph
        thread_id = "test-real-llm-02"
        config = {"configurable": {"thread_id": thread_id}}
        inputs = {"messages": [HumanMessage(content="Leaky faucet.")], "request_id": thread_id}
        
        for event in app.stream(inputs, config=config):
            for node_name, content in event.items():
                print(f"[{node_name}] Processed")
        
        # 3. Assertions
        final_state = app.get_state(config)
        # Should have gone Triage -> Knowledge (Landlord) -> Execution -> Human Approval
        self.assertEqual(final_state.values['classification'], "routine")
        self.assertEqual(final_state.values['maintenance_category'], "plumbing")
        # Should be pending approval
        self.assertEqual(final_state.next, ('dispatch',))

        print("SUCCESS: Graph correctly handled Mocked LLM 'Routine' response.")

if __name__ == "__main__":
    unittest.main()
