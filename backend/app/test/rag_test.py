import asyncio

from app.db.session import (
    AsyncSessionLocal
)

from app.services.rag_service import (
    RagService
)


async def main():

    async with AsyncSessionLocal() as db:

        stream = (
            RagService.stream_answer(
                chat_id=36,
                question=
                "Who is this certificate issued to?",
                db=db
            )
        )

        async for token in stream:
            print(
                token,
                end="",
                flush=True
            )


if __name__ == "__main__":
    asyncio.run(main())