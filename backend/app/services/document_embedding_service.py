from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.document import Document
from app.db.models.document_chunk import DocumentChunk

from app.services.embedding_service import EmbeddingService

class DocumentEmbeddingService:

    @staticmethod
    async def generate_embeddings(
        document_id: int,
        db: AsyncSession
    ):
        query = select(
            DocumentChunk
        ).where(
            DocumentChunk.document_id == document_id,
            DocumentChunk.embedding.is_(None)
        )

        result = await db.execute(query)

        chunks = result.scalars().all()
        for chunk in chunks:
            chunk.embedding = (
                EmbeddingService.generate_embedding(
                    chunk.content
                )
            )
        
        document_query = select(
            Document
        ).where(
            Document.id == document_id
        )

        document_result = await db.execute(document_query)

        document = document_result.scalar_one()
        document.status = "EMBEDDED"
        await db.commit()
        
        print("document status is set now to: EMBEDDED")
