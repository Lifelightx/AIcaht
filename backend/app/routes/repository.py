from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependency import get_db
from app.services.repository_service import RepositoryService
from app.services.repository_clone_service import RepositoryCloneService
from app.services.repository_chunk import RepositoryChunkService
from app.services.repository_embedding import RepositoryEmbeddingService
from app.schema.repository import RepositoryCreate
from app.db.models.user import User
from app.utils.dependencies import get_current_user
router = APIRouter(
    prefix="/api/repositories",
    tags=["repositories"]
)


@router.post("/create/{chat_id}")
async def create_repository(
    chat_id: int,
    request: RepositoryCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repository = (
        await RepositoryService.create_repository(
            db=db,
            chat_id=chat_id,
            user_id=user.id,
            repository_url=request.repository_url
        )
    )

    return repository

@router.post("/clone/{repository_id}")
async def clone_repository(
    repository_id: int,
    db: AsyncSession = Depends(get_db)
):
    success = (
        await RepositoryCloneService
        .clone_repository(
            repository_id=repository_id,
            access_token=None,
            db=db
        )
    )

    return {
        "success": success
    }


@router.post(
    "/{repository_id}/chunk"
)
async def chunk_repository(
    repository_id: int,
    db: AsyncSession = Depends(get_db)
):
    success = await (
        RepositoryChunkService
        .process_repository(
            repository_id,
            db
        )
    )

    return {
        "success": success
    }


@router.post(
    "/{repository_id}/embed"
)
async def embed_repository(
    repository_id: int,
    db: AsyncSession = Depends(get_db)
):
    success = (
        await RepositoryEmbeddingService
        .generate_embeddings(
            repository_id,
            db
        )
    )

    return {
        "success": success
    }

@router.get("/{repository_id}/search")
