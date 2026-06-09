import os
import shutil
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.chat import Chat
from app.db.models.repository import Repository
from app.db.models.document import Document

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
            # Clean up document files
            doc_query = select(Document).where(Document.chat_id == chat_id)
            doc_result = await db.execute(doc_query)
            docs = doc_result.scalars().all()
            for doc in docs:
                if doc.file_path and os.path.exists(doc.file_path):
                    try:
                        os.unlink(doc.file_path)
                    except Exception as e:
                        print(f"Error deleting document file {doc.file_path}: {e}")
            
            # Clean up repository folders
            repo_query = select(Repository).where(Repository.chat_id == chat_id)
            repo_result = await db.execute(repo_query)
            repos = repo_result.scalars().all()
            for repo in repos:
                if repo.local_path and os.path.exists(repo.local_path) and os.path.isdir(repo.local_path):
                    try:
                        shutil.rmtree(repo.local_path)
                    except Exception as e:
                        print(f"Error deleting repository folder {repo.local_path}: {e}")

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