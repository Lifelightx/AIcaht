import os
import shutil
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.chat import Chat
from app.db.models.repository import Repository
from app.utils.repository_provider import RepositoryProvider
from app.db.enums.repo_status import RepositoryStatus
class RepositoryService:

    @staticmethod
    async def create_repository(
        db:AsyncSession,
        chat_id: int,
        user_id: int,
        repository_url: str
    )-> Repository:
        
        existing = await RepositoryService.repository_exists(
            db=db,
            chat_id=chat_id,
            repository_url=repository_url
        )
        if existing:
            raise ValueError(
                "Repository already exists"
            )
        
        
        chat_query = (
            select(Chat).where(
                Chat.id == chat_id,
                Chat.user_id == user_id
            )
        )
        chat_result = await db.execute(chat_query)
        chat = chat_result.scalar_one_or_none()

        if not chat:
            raise ValueError(
                "chat not found"
            )
        repo_name = (
            repository_url
            .rstrip("/")
            .split("/")[-1]
            .replace(".git","")

        )
        provider = RepositoryProvider.detect_provider(repository_url=repository_url)

        repository = Repository(
            chat_id= chat_id,
            repository_url= repository_url,
            name= repo_name,
            provider= provider,
            local_path ="",
            status="PENDING",
        )

        db.add(repository)
        await db.commit()
        await db.refresh(repository)

        return repository
    
    @staticmethod
    async def get_repository(
        db: AsyncSession,
        repository_id: int,
        
    )->Repository | None:
        query = (
            select(Repository)
            .where(
                Repository.id == repository_id,
            )
        )
        result = await db.execute(query)

        return result.scalar_one_or_none()

    @staticmethod
    async def get_chat_repositories(
        db: AsyncSession,
        chat_id: int,
        user_id: int,

    )-> list[Repository]:
        query = (
            select(Repository)
            .join(
                Chat,
                Repository.chat_id == Chat.id
            )
            .where(
                Chat.id == chat_id,
                Chat.user_id == user_id
            )
            .order_by(
                Repository.created_at.desc()
            )
        )

        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def delete_repository(
        db: AsyncSession,
        repository_id: int,
        user_id: int
    )-> bool:
        query = (
             select(Repository)
            .join(
                Chat,
                Repository.chat_id == Chat.id
            )
            .where(
                Repository.id == repository_id,
                Chat.user_id == user_id
            )
        )
        result = await db.execute(query)

        repository = result.scalar_one_or_none()
        if repository is None:
            return False
        
        local_path = repository.local_path
        
        await db.delete(repository)
        await db.commit()
        
        if local_path and os.path.exists(local_path) and os.path.isdir(local_path):
            try:
                shutil.rmtree(local_path)
            except Exception as e:
                print(f"Error deleting repository folder {local_path}: {e}")
        
        return True
    @staticmethod
    async def update_status(
        db: AsyncSession,
        repository_id: int,
        status: str,
    ) -> Repository | None:
        repository = await (
            RepositoryService.get_repository(
                db=db,
                repository_id=repository_id
            )
        )
        if repository is None:
            return None
        
        repository.status = status
        await db.commit()
        await db.refresh(repository)
        return repository
    
    @staticmethod
    async def update_local_path(
        db: AsyncSession,
        repository_id: int,
        local_path: str
    )-> Repository | None:
        
        repository = await(
            RepositoryService.get_repository(
                db=db,
                repository_id=repository_id
            )
        )
        if repository is None:
            return None
        repository.local_path = local_path

        await db.commit()
        await db.refresh(repository)

        return repository
    
    @staticmethod
    async def repository_exists(
        db: AsyncSession,
        chat_id: int,
        repository_url: str
    ) -> bool:
        query = (
            select(Repository)
            .where(
                Repository.chat_id == chat_id,
                Repository.repository_url == repository_url
            )
        )

        result = await db.execute(query)
        repository = result.scalar_one_or_none()
        if repository is None:
            return False
        return True

    @staticmethod
    async def has_embedded_repositories(
        chat_id: int,
        db: AsyncSession
    )-> bool:
        query = select(
            Repository
        ).where(
            Repository.chat_id == chat_id,
            Repository.status == RepositoryStatus.READY
        ).limit(1)

        result = await db.execute(query)
        embedded_repository = result.scalar_one_or_none()
        if embedded_repository is None:
            return False
        
        return True

    async def get_first_ready_repository(
            chat_id: int,
            db: AsyncSession 
    ):
        query = (
        select(Repository)
        .where(
            Repository.chat_id == chat_id,
            Repository.status == RepositoryStatus.READY
        )
        .limit(1)
        )

        result = await db.execute(query)

        return result.scalar_one_or_none()



        