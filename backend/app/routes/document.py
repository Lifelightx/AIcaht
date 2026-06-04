from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    BackgroundTasks
)

from app.db.dependency import get_db
from app.db.models.user import User
from app.services.document_service import DocumentService
from app.utils.dependencies import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from app.utils.background_task import generate_embedding_task
router = APIRouter(
    prefix="/api/docs",
    tags=["Documents"]
)

@router.post("/chat/{chat_id}")
async def upload_document(
    chat_id:int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
    background_task: BackgroundTasks = None
):
    
    try:
        document = await DocumentService.upload_document(
            chat_id=chat_id,
            file=file,
            db=db,
            user_id= user.id
        )
        background_task.add_task(
            generate_embedding_task,
            document["document_id"]
        )

        return {
            "data": document,
            "message": "file uploaed sucessfully"
        }
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
