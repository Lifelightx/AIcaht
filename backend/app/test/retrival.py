from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.services.rag.retrival_service import RetrievalService
import asyncio


async def retrieval_test():
    async with AsyncSessionLocal() as db:

        results = await (
            RetrievalService.retrieve_chunks(
                chat_id=36,
                question="what is the anuual income?",
                db=db
            )
        )
        print(
            f"Retrieved {len(results)} chunks"
        )

        print("\n" + "=" * 80)

        for chunk, document in results:

            print(
                f"Document: {document.filename}"
            )

            print(
                f"Page: {chunk.page_number}"
            )

            print(
                f"Chunk ID: {chunk.id}"
            )

            print("\nContent:")

            print(
                chunk.content[:500]
            )

            print("\n" + "=" * 80)


if __name__ == "__main__":

    asyncio.run(
        retrieval_test()
    )