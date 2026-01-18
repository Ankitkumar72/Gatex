import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from src.tiny_vector_store import TinyVectorStore

def ingest_lease():
    print("--- Ingesting Lease into TinyVectorStore ---")
    
    # 1. Check for API Key
    if "GOOGLE_API_KEY" not in os.environ:
        print("Error: GOOGLE_API_KEY not set.")
        return

    # 2. Read the file
    file_path = os.path.join(os.path.dirname(__file__), "..", "sample_lease.txt")
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 3. Simple chunking
    raw_chunks = [c.strip() for c in content.split("\n\n") if c.strip()]
    print(f"Read {len(raw_chunks)} chunks.")

    # 4. Initialize Embedding Model
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

    # 5. Get Embeddings
    print("Generating embeddings via Google Gemini...")
    vectors = embeddings.embed_documents(raw_chunks)

    # 6. Initialize TinyVectorStore
    db_path = os.path.join(os.path.dirname(__file__), "..", "propflow_knowledge.json")
    vector_store = TinyVectorStore(persist_path=db_path)
    
    # 7. Add to Store
    vector_store.add_documents(raw_chunks, vectors)
    
    print(f"SUCCESS: Ingested {len(raw_chunks)} vectors to {db_path}.")
    
    # Test
    print("\n--- Test Query: 'Who fixes the faucet?' ---")
    q_vec = embeddings.embed_query("Who fixes the faucet?")
    results = vector_store.similarity_search(q_vec, k=1)
    if results:
        print(f"Result: {results[0]}")

if __name__ == "__main__":
    ingest_lease()
