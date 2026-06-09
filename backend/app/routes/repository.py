from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependency import get_db
from app.services.repository.repository_service import RepositoryService
from app.schema.repository import RepositoryCreate
from app.db.models.user import User
from app.utils.dependencies import get_current_user
from app.utils.background_task import process_repository_task
router = APIRouter(
    prefix="/api/repositories",
    tags=["repositories"]
)


@router.post("/create/{chat_id}")
async def create_repository(
    chat_id: int,
    request: RepositoryCreate,
    background_task: BackgroundTasks,
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
    background_task.add_task(
        process_repository_task,
        repository.id,
        request.access_token
    )

    return repository



@router.get("/chat/{chat_id}")
async def get_chat_repositories(
    chat_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    repositories = await RepositoryService.get_chat_repositories(
        db=db,
        chat_id=chat_id,
        user_id=user.id
    )
    return {
        "data": repositories,
        "message": "all repositories are sent"
    }

@router.delete("/{repository_id}")
async def delete_repository(
    repository_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    await RepositoryService.delete_repository(
        repository_id=repository_id,
        user_id=user.id,
        db=db
    )
    return {
        "message": "repository deleted successfully"
    }

@router.get("/{repository_id}/status")
async def get_repository_status(
    repository_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    repository = await RepositoryService.get_repository(
        db=db,
        repository_id=repository_id
    )
    if not repository:
        raise HTTPException(status_code=404, detail="Repository not found")
    return {"status": repository.status}