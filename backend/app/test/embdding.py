from app.services.embedding_service import (
    EmbeddingService
)

embedding = (
    EmbeddingService.generate_embeddings(
        "What is AI?"
    )
)

print(type(embedding))
print(len(embedding))
print(embedding[:5])