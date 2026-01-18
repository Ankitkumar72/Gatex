import unittest
import os
import sys
import json
from unittest.mock import MagicMock, patch

# Add root project to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.tiny_vector_store import TinyVectorStore
from src.tools import search_lease_rag

class TestRAG(unittest.TestCase):
    def setUp(self):
        # Use a temporary file for the test DB
        self.test_db_path = "test_knowledge.json"
        if os.path.exists(self.test_db_path):
            os.remove(self.test_db_path)

    def tearDown(self):
        if os.path.exists(self.test_db_path):
            os.remove(self.test_db_path)

    @patch('src.tools.GoogleGenerativeAIEmbeddings')
    @patch('src.tools.DB_PATH', "test_knowledge.json") # Patch the DB_PATH global in tools
    @patch.dict(os.environ, {"GOOGLE_API_KEY": "dummy"})
    def test_rag_flow(self, mock_embeddings_cls):
        print("\n--- Testing RAG Tool with Mocked Embeddings ---")
        
        # 1. Setup Mock Embeddings
        mock_embedding_instance = MagicMock()
        mock_embeddings_cls.return_value = mock_embedding_instance
        
        # Define mock behavior: "appliance" -> [1, 0], "strucutre" -> [0, 1]
        # This allows us to test cosine similarity logic deterministically
        def mock_embed_query(text):
            if "appliance" in text.lower():
                return [1.0, 0.0, 0.0]
            if "lawn" in text.lower():
                return [0.0, 1.0, 0.0]
            # Noise
            return [0.0, 0.0, 1.0]
            
        mock_embedding_instance.embed_query.side_effect = mock_embed_query
        
        # 2. Populate TinyVectorStore manually (simulating ingest.py)
        store = TinyVectorStore(self.test_db_path)
        store.add_documents(
            text_list=["Landlord fixes appliances.", "Tenant mows the lawn.", "The sky is blue.", "Birds fly high."],
            embedding_list=[[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0], [0.0, 0.0, 1.0]]
        )
        
        # 3. Call the Tool (which uses the patched DB_PATH)
        # Query for "appliance" -> matches [1, 0] -> "Landlord fixes appliances."
        result = search_lease_rag.invoke("Who fixes the appliance?")
        
        print(f"Tool Output:\n{result}")
        
        # 4. Assertions
        self.assertIn("Policy Information", result)
        self.assertIn("Landlord fixes appliances", result)
        # Note: k=2 might return 'Tenant mows the lawn' as a secondary result even if score is 0 in this tiny DB.
        # We just care that the correct answer IS found.
        
        print("SUCCESS: RAG Tool retrieved the correct document based on vector similarity.")

if __name__ == "__main__":
    unittest.main()
