from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


from app.db.models.repository import Repository
from app.db.models.repository_chunk import RepositoryChunk

from app.services.llm.embedding_service import EmbeddingService
from app.services.repository.repository_service import RepositoryService

from app.db.enums.repo_status import RepositoryStatus

class RepositoryEmbeddingService:

    @staticmethod
    async def generate_embeddings(
        repository_id: int,
        db: AsyncSession
    ):
        repository = await (
            RepositoryService.get_repository(
                db=db,
                repository_id=repository_id
            )
        )
        if repository is None:
            return False
        
        await RepositoryService.update_status(
            db=db,
            repository_id=repository.id,
            status=RepositoryStatus.EMBEDDING
        )

        try:
            query = select(
                RepositoryChunk
            ).where(
                RepositoryChunk.repository_id == repository_id,
                RepositoryChunk.embedding.is_(None)
            )

            result = await db.execute(query)

            chunks = result.scalars().all()

            print(
                f"Generating embeddings for "
                f"{len(chunks)} chunks"
            )

            for chunk in chunks:
                chunk.embedding = (
                    EmbeddingService.generate_embeddings(
                        chunk.content
                    )
                )

            await db.commit()

            await RepositoryService.update_status(
                db=db,
                repository_id=repository_id,
                status=RepositoryStatus.READY
            )

            print(
                f"Repository "
                f"{repository_id} "
                f"is READY"
            )

            return True
        
        except Exception as e:
            print(
                f"Embedding failed: {e}"
            )

            await RepositoryService.update_status(
                db=db,
                repository_id=repository_id,
                status=RepositoryStatus.FAILED
            )

            return False

