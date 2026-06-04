from app.db.session import (
    AsyncSessionLocal
)

from app.services.document_embedding_service import DocumentEmbeddingService

async def generate_embedding_task(
        document_id: int
):
    async with AsyncSessionLocal() as db:
        await (
            DocumentEmbeddingService.generate_embeddings(
                document_id=document_id,
                db=db
            )
        )