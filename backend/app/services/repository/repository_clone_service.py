import os
import subprocess
from urllib.parse import urlparse

from sqlalchemy.ext.asyncio import AsyncSession

from app.services.repository.repository_service import RepositoryService
from app.db.enums.repo_status import RepositoryStatus

class RepositoryCloneService:

    STORAGE_PATH = "uploads/repository"

    @staticmethod
    def build_clone_url(
        repository_url: str,
        provider: str,
        access_token: str | None
    )-> str:
        if not access_token:
            return repository_url
        
        parsed = urlparse(
            repository_url
        )
        hostname = parsed.hostname
        path = parsed.path

        if provider == "github":
            return (
                f"https://{access_token}"
                f"@{hostname}"
                f"{path}"
            )
        if provider == "gitlab":
            return (
                f"https://oauth2:{access_token}"
                f"@{hostname}"
                f"{path}"
            )
        
        return repository_url
    
    @staticmethod
    async def clone_repository(
        repository_id: int,
        access_token: str | None,
        db: AsyncSession
    )-> bool:
        
        repository = await(
            RepositoryService.get_repository(db=db, repository_id=repository_id)
        )
        if not repository:
            return False
        
        await RepositoryService.update_status(
            db=db,
            repository_id=repository_id,
            status=RepositoryStatus.CLONING
        )

        destination = os.path.join(
            RepositoryCloneService.STORAGE_PATH,
            str(repository.id)
        )
        os.makedirs(
            RepositoryCloneService.STORAGE_PATH,
            exist_ok=True
        )

        clone_url = (
            RepositoryCloneService.build_clone_url(
                repository_url= repository.repository_url,
                provider=repository.provider,
                access_token=access_token
            )
        )
        try:
            subprocess.run(
                [
                    "git",
                    "clone",
                    "--depth",
                    "1",
                    clone_url,
                    destination
                ],
                check=True,
                timeout=300,
                capture_output=True,
                text=True
            )

            await RepositoryService.update_local_path(
                db=db,
                repository_id= repository.id,
                local_path= destination
            )
            await RepositoryService.update_status(
                db=db,
                repository_id=repository.id,
                status=RepositoryStatus.CLONED
            )
            return True
        except subprocess.CalledProcessError as e:
            print(
                f"clone failed {e.stderr}"
            )
            await RepositoryService.update_status(
                db=db,
                repository_id=repository.id,
                status= RepositoryStatus.FAILED
            )
            return False
        except subprocess.TimeoutExpired as e:
            await RepositoryService.update_status(
                db=db,
                repository_id=repository.id,
                status=RepositoryStatus.FAILED
            )
            return False
        



        


