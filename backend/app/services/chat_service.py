from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.chat import Chat

class ChatService:

    @staticmethod
    async def create_chat(
        db: AsyncSession,
        user_id: int
    ):
        chat = Chat(
            title = "New chat",
            user_id = user_id
        )
        db.add(chat)
        await db.commit()
        await db.refresh(chat)
        return chat
    
    @staticmethod
    async def get_user_chats(
        db: AsyncSession,
        user_id: int
    ):
        query = (
            select(Chat)
            .where(Chat.user_id == user_id)
            .order_by(Chat.created_at.desc())
        )

        result = await db.execute(query)
        return result.scalars().all()
