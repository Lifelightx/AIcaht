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

    @staticmethod
    async def delete_chat(db: AsyncSession,chat_id: int, user_id:int):
        query = select(Chat).where(Chat.id == chat_id , Chat.user_id == user_id)
        result = await db.execute(query)
        chat = result.scalar_one_or_none()
        if chat == None:
            return False
        if chat:
            await db.delete(chat)
            await db.commit()
            return True
        return False
    
    @staticmethod
    async def rename_chat(
        db:AsyncSession,
        chat_id: int,
        user_id:int,
        new_title: str
    ):
        query = select(Chat).where(
            Chat.id == chat_id,
            Chat.user_id == user_id
        )
        result = await db.execute(query)
        chat = result.scalar_one_or_none()
        if chat:
            chat.title = new_title
            await db.commit()
            await db.refresh(chat)
            return chat
        return None