from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.document_chunk import DocumentChunk
from app.db.models.document import Document
from app.services.embedding_service import EmbeddingService

class RetrievalService:

    @staticmethod
    async def retrieve_chunks(
        chat_id: int,
        question: str,
        db: AsyncSession,
        limit: int = 10
    ):
        query_embedding = (
            EmbeddingService.generate_embedding(
                question
            )
        )

        query = (
            select(
                DocumentChunk,
                Document
            )
            .join(
                Document,
                DocumentChunk.document_id == Document.id
            )
            .where(
                Document.chat_id == chat_id,
                Document.status == "EMBEDDED",
                DocumentChunk.embedding.is_not(None)
            )
            .order_by(
                DocumentChunk.embedding.cosine_distance(
                    query_embedding
                )
            )
            .limit(limit)
        )

        result = await db.execute(
            query
        )

        return result.all()
