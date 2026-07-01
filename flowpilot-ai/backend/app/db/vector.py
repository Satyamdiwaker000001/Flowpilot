from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
import uuid
import logging

logger = logging.getLogger(__name__)

class VectorDBManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorDBManager, cls).__new__(cls)
            cls._instance.init_db()
        return cls._instance

    def init_db(self):
        logger.info("Initializing Vector DB (Qdrant) and Embedding Model...")
        # Use memory storage for V1
        self.client = QdrantClient(":memory:")
        self.collection_name = "documents"
        
        # Load embedding model
        self.embed_model = SentenceTransformer("all-MiniLM-L6-v2")
        self.vector_size = self.embed_model.get_sentence_embedding_dimension()

        # Create collection if not exists
        if not self.client.collection_exists(self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
            )
            logger.info(f"Created Qdrant collection: {self.collection_name}")

    def generate_embedding(self, text: str) -> list[float]:
        """Generates embedding for a single string."""
        return self.embed_model.encode(text).tolist()

    def upsert_chunks(self, chunks: list[str], metadata: dict):
        """Embeds and upserts chunks into Qdrant."""
        if not chunks:
            return

        embeddings = self.embed_model.encode(chunks)
        points = []
        for i, chunk in enumerate(chunks):
            point_id = str(uuid.uuid4())
            # Include original text in payload
            payload = {**metadata, "text": chunk, "chunk_index": i}
            points.append(
                PointStruct(id=point_id, vector=embeddings[i].tolist(), payload=payload)
            )

        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        logger.info(f"Upserted {len(chunks)} chunks to Vector DB.")

    def search(self, query: str, limit: int = 3, filter_dict: dict = None) -> list[dict]:
        """Searches for relevant chunks based on semantic similarity."""
        query_vector = self.generate_embedding(query)
        
        # We can implement filtering by file_id if needed in the future using qdrant_client.models.Filter
        search_result = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit,
            # query_filter=Filter(...) if filter_dict else None
        )
        
        results = []
        for hit in search_result:
            results.append({
                "score": hit.score,
                "text": hit.payload.get("text"),
                "file_id": hit.payload.get("file_id"),
                "filename": hit.payload.get("filename")
            })
            
        return results

vector_db = VectorDBManager()
