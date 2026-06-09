import os

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.repository_chunk import (
    RepositoryChunk
)

from app.services.llm.chunk_service import (
    ChunkService
)

from app.services.repository.repository_service import (
    RepositoryService
)

from app.db.enums.repo_status import (
    RepositoryStatus
)


class RepositoryChunkService:

    IGNORED_DIRECTORIES = {
        ".git",
        "node_modules",
        ".venv",
        "__pycache__",
        "build",
        "dist",
        ".next",
        ".idea",
        ".vscode",
        "coverage",
        ".pytest_cache"
    }

    ALLOWED_EXTENSIONS = {
        ".py",
        ".js",
        ".ts",
        ".tsx",
        ".jsx",
        ".java",
        ".go",
        ".rs",
        ".kt",
        ".c",
        ".cpp",
        ".h",
        ".hpp",
        ".html",
        ".css"
        ".json",
        ".yaml",
        ".yml",
        ".md",
        ".sql",
        ".sh",
        ".dockerfile"
    }

    @staticmethod
    async def process_repository(
        repository_id: int,
        db: AsyncSession
    ) -> bool:

        repository = await (
            RepositoryService.get_repository(
                db=db,
                repository_id=repository_id
            )
        )

        if repository is None:
            return False

        await RepositoryService.update_status(
            db=db,
            repository_id=repository_id,
            status=RepositoryStatus.CHUNKING
        )

        try:

            total_chunks = 0

            for root, dirs, files in os.walk(
                repository.local_path
            ):

                dirs[:] = [
                    directory
                    for directory in dirs
                    if directory not in (
                        RepositoryChunkService
                        .IGNORED_DIRECTORIES
                    )
                ]

                for file_name in files:

                    extension = os.path.splitext(
                        file_name
                    )[1].lower()

                    if (
                        extension not in
                        RepositoryChunkService
                        .ALLOWED_EXTENSIONS
                    ):
                        continue

                    absolute_path = os.path.join(
                        root,
                        file_name
                    )

                    relative_path = os.path.relpath(
                        absolute_path,
                        repository.local_path
                    )

                    chunks_created = await (
                        RepositoryChunkService
                        .process_file(
                            repository_id=repository.id,
                            absolute_path=absolute_path,
                            relative_path=relative_path,
                            db=db
                        )
                    )

                    total_chunks += chunks_created
            
            await RepositoryService.update_status(
                db=db,
                repository_id=repository_id,
                status=RepositoryStatus.EMBEDDING
            )

            print(
                f"Repository {repository.id} "
                f"chunked successfully. "
                f"Created {total_chunks} chunks."
            )

            return True

        except Exception as e:

            print(
                f"Repository chunking failed: {e}"
            )

            await RepositoryService.update_status(
                db=db,
                repository_id=repository_id,
                status=RepositoryStatus.FAILED
            )

            return False

    @staticmethod
    async def process_file(
        repository_id: int,
        absolute_path: str,
        relative_path: str,
        db: AsyncSession
    ) -> int:

        try:

            with open(
                absolute_path,
                "r",
                encoding="utf-8"
            ) as file:
                content = file.read()

        except UnicodeDecodeError:
            return 0

        except Exception:
            return 0

        if not content.strip():
            return 0

        chunks = (
            ChunkService.chunk_code(
                content
            )
        )

        start_line = 1

        chunk_count = 0

        for chunk in chunks:

            line_count = len(
                chunk.splitlines()
            )

            end_line = (
                start_line
                + line_count
                - 1
            )

            repository_chunk = (
                RepositoryChunk(
                    repository_id=repository_id,
                    file_path=relative_path,
                    content=chunk,
                    start_line=start_line,
                    end_line=end_line
                )
            )

            db.add(
                repository_chunk
            )

            chunk_count += 1

            start_line = (
                end_line + 1
            )

        await db.commit()

        return chunk_count