from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from app.schema.chat import ChatRequest, RenameRequest

from app.db.dependency import get_db
from app.schema.chat import ChatResponse
from app.services.message_services import MessageService
from app.services.chat_service import ChatService
from app.schema.message import(
    MessageRequest,
    MessageResponse
)
from app.db.dependency import get_db
from sqlalchemy.ext.asyncio import AsyncSession

from app.utils.dependencies import get_current_user
from app.db.models.user import User
router = APIRouter(
    prefix="/api/chats",
    tags=["chats"],
    dependencies=[Depends(get_current_user)]
)

@router.get("", response_model=list[ChatResponse])
async def get_chats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await ChatService.get_user_chats(
        db=db,
        user_id=current_user.id
    )

@router.post("/stream")
async def create_chat_and_stream(
    request: MessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    generator = (
        MessageService.create_and_stream_chat(
            db=db,
            user_id=current_user.id,
            message=request.message,
            model=request.model
        )
    )
    return StreamingResponse(
        generator,
        media_type="text/event-stream"
    )

@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
async def get_chat_message(
    chat_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await MessageService.get_chat_message(
        db=db,
        chat_id=chat_id,
        user_id=current_user.id
    )

@router.post(
    "/{chat_id}/stream"
)
async def stream_message(
    chat_id:int,
    request: MessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    generator = MessageService.stream_message(
        db=db,
        chat_id=chat_id,
        user_id=current_user.id,
        message=request.message,
        model=request.model
    )
    return StreamingResponse(
        generator,
        media_type="plain/text"
    )


@router.delete("/{chat_id}")
async def delete_chat(

    chat_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sucess = await ChatService.delete_chat(
        db=db,
        chat_id=chat_id,
        user_id=current_user.id
    )
    if not sucess:
        raise HTTPException(
            status_code=404,
            detail="chat not found or unauthorized"
        )
    return {"message": "chat deleted sucessfully"}

@router.patch("/{chat_id}/rename")
async def rename_chat(
    chat_id:int,
    request: RenameRequest,
    db: AsyncSession = Depends(get_db),
    current_user:User = Depends(get_current_user)
):
    renamed_chat = await ChatService.rename_chat(
        db=db,
        chat_id=chat_id,
        user_id=current_user.id,
        new_title=request.title
    )
    if renamed_chat is None:
        raise HTTPException(
            status_code=404,
            detail="chat not found or anauthorized"
        )
    return {"id":renamed_chat.id, "title": renamed_chat.title}
