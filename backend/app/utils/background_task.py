from app.db.session import (
    AsyncSessionLocal
)

from app.services.document_embedding_service import DocumentEmbeddingService
from app.services.repository_clone_service import RepositoryCloneService
from app.services.repository_chunk import RepositoryChunkService
from app.services.repository_embedding import RepositoryEmbeddingService

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

async def process_repository_task(
        repository_id: int,
        access_token: str | None = None
):
    async with AsyncSessionLocal() as db:
        cloned = await RepositoryCloneService.clone_repository(
            repository_id=repository_id,
            access_token=access_token,
            db=db
        )
        if not cloned:
            return

        chunked = await RepositoryChunkService.process_repository(
            repository_id=repository_id,
            db=db
        )
        if not chunked:
            return

        await RepositoryEmbeddingService.generate_embeddings(
            repository_id=repository_id,
            db=db
        )