from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.repository_chunk import (
    RepositoryChunk
)

from app.services.llm.embedding_service import (
    EmbeddingService
)


class RepositoryRetrievalService:

    @staticmethod
    async def retrieve_chunks(
        repository_id: int,
        question: str,
        db: AsyncSession,
        limit: int = 10
    ):

        query_embedding = (
            EmbeddingService.generate_embeddings(
                question
            )
        )

        query = (
            select(
                RepositoryChunk
            )
            .where(
                RepositoryChunk.repository_id
                == repository_id,
                RepositoryChunk.embedding.is_not(
                    None
                )
            )
            .order_by(
                RepositoryChunk.embedding.cosine_distance(
                    query_embedding
                )
            )
            .limit(limit)
        )

        result = await db.execute(
            query
        )

        return result.scalars().all()