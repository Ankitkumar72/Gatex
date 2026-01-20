import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from src.tiny_vector_store import TinyVectorStore

def ingest_lease():
    print("--- Ingesting Lease into TinyVectorStore ---")
    
    # Load .env manually
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

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

    # 3. Splitting with Overlap and Metadata
    import re
    
    def split_text_with_metadata(text, chunk_size=1000, overlap=100):
        chunks = []
        metadatas = []
        
        lines = text.split('\n')
        current_section = "General"
        
        current_chunk = []
        current_len = 0
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Heuristic for section headers (e.g. "1. TERM", "4. REPAIRS")
            if re.match(r'^\d+\.\s+[A-Z\s]+$', line):
                current_section = line
                
            # If adding this line exceeds chunk size, save chunk and start new one with overlap
            if current_len + len(line) > chunk_size and current_chunk:
                # HEADER INJECTION: Prepend the section header to the text
                chunk_text = f"[{current_section}] " + " ".join(current_chunk)
                
                chunks.append(chunk_text)
                metadatas.append({"section": current_section})
                
                # Keep overlap
                overlap_len = 0
                new_chunk = []
                for prev_line in reversed(current_chunk):
                    if overlap_len + len(prev_line) < overlap:
                        new_chunk.insert(0, prev_line)
                        overlap_len += len(prev_line)
                    else:
                        break
                current_chunk = new_chunk
                current_len = overlap_len
            
            current_chunk.append(line)
            current_len += len(line)
            
        if current_chunk:
             # HEADER INJECTION for last chunk
            chunk_text = f"[{current_section}] " + " ".join(current_chunk)
            chunks.append(chunk_text)
            metadatas.append({"section": current_section})
            
        return chunks, metadatas

    raw_chunks, metadatas = split_text_with_metadata(content)
    print(f"Created {len(raw_chunks)} chunks with metadata.")

    # 4. Initialize Embedding Model
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

    # 5. Get Embeddings
    print("Generating embeddings via Google Gemini...")
    vectors = embeddings.embed_documents(raw_chunks)

    # 6. Initialize TinyVectorStore
    db_path = os.path.join(os.path.dirname(__file__), "..", "propflow_knowledge.json")
    vector_store = TinyVectorStore(persist_path=db_path)
    
    # 7. Add to Store
    vector_store.add_documents(raw_chunks, vectors, metadatas)
    
    print(f"SUCCESS: Ingested {len(raw_chunks)} vectors to {db_path}.")
    
    # Test
    print("\n--- Test Query: 'Who fixes the faucet?' ---")
    q_vec = embeddings.embed_query("Who fixes the faucet?")
    results = vector_store.similarity_search(q_vec, k=1)
    if results:
        print(f"Result: {results[0]}")

if __name__ == "__main__":
    ingest_lease()
