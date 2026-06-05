from sqlalchemy.ext.asyncio import AsyncSession

from app.services.retrival_service import RetrievalService
from app.services.ai_services import AIService

class RagService:

    @staticmethod
    async def stream_answer(
        chat_id: int,
        question: str,
        db: AsyncSession,
        model: str = "geema4-cloud"
    ):

        results = await (
            RetrievalService.retrieve_chunks(
                chat_id=chat_id,
                question=question,
                db=db
            )
        )

        if not results:
            yield (
                "I could not find relevant "
                "information in the uploaded "
                "documents."
            )
            return

        context_parts = []

        for chunk, document in results:

            context_parts.append(
                f"""
                Document: {document.filename}
                Page: {chunk.page_number}

                {chunk.content}
                """
            )

        context = "\n\n".join(
            context_parts
        )

        prompt = f"""
                    You are a document assistant.

                    Answer only using the provided context.

                    If the answer is not found in the context,
                    respond exactly:

                    I could not find that information in the uploaded documents.

                    Context:

                    {context}

                    Question:   

                    {question}
                    """

        messages = [
            {
                "role": "user",
                "content": prompt
            }
        ]

        async for token in (
            AIService.stream_response(
                messages=messages,
                model=model
            )
        ):
            yield token