import json
import os
import math
from typing import List, Dict, Any

class TinyVectorStore:
    """
    A lightweight, dependency-free vector store for the MVP.
    Stores embeddings in a JSON file and performs linear scan cosine similarity.
    Perfect for small datasets (< 1000 items) where installing Chroma/FAISS is overkill or problematic.
    """
    def __init__(self, persist_path: str):
        self.persist_path = persist_path
        self.documents: List[Dict[str, Any]] = []
        self._load()

    def _load(self):
        if os.path.exists(self.persist_path):
            with open(self.persist_path, "r", encoding="utf-8") as f:
                self.documents = json.load(f)

    def save(self):
        with open(self.persist_path, "w", encoding="utf-8") as f:
            json.dump(self.documents, f)

    def add_documents(self, text_list: List[str], embedding_list: List[List[float]], metadatas: List[Dict[str, Any]] = None):
        if metadatas is None:
            metadatas = [{} for _ in text_list]
            
        for text, vector, meta in zip(text_list, embedding_list, metadatas):
            self.documents.append({
                "content": text,
                "vector": vector,
                "metadata": meta
            })
        self.save()

    def similarity_search(self, query_vector: List[float], k: int = 2) -> List[str]:
        if not self.documents:
            return []

        # Calculate Cosine Similarity with every doc
        scores = []
        for doc in self.documents:
            v = doc["vector"]
            score = self._cosine_similarity(query_vector, v)
            scores.append((score, doc["content"], doc.get("metadata", {})))

        # Sort by score descending
        scores.sort(key=lambda x: x[0], reverse=True)
        
        # Return top k docs (content + metadata)
        return [{"content": item[1], "metadata": item[2]} for item in scores[:k]]

    def _cosine_similarity(self, v1: List[float], v2: List[float]) -> float:
        dot_product = sum(a*b for a,b in zip(v1, v2))
        magnitude1 = math.sqrt(sum(a*a for a in v1))
        magnitude2 = math.sqrt(sum(b*b for b in v2))
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        return dot_product / (magnitude1 * magnitude2)
