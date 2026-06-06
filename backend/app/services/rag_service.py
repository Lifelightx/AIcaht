from sqlalchemy.ext.asyncio import AsyncSession

from app.services.retrival_service import RetrievalService
from app.services.ai_services import AIService

class RagService:

    @staticmethod
    async def stream_answer(
        chat_id: int,
        question: str,
        messages: list,
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

        context_parts = []
        if results:
            for chunk, document in results:
                context_parts.append(
                    f"""
                    Document: {document.filename}
                    Page: {chunk.page_number}

                    {chunk.content}
                    """
                )

        context = "\n\n".join(context_parts) if context_parts else "No relevant context found in the uploaded documents for this specific query."

        system_prompt = f"""
You are a helpful AI assistant. The user has uploaded documents to this chat.
Below is the retrieved context from those documents related to the user's latest message.

Context from documents:
{context}

Instructions:
- If the user's question can be answered using the provided context, answer it using ONLY the context.
- If the user's question is completely unrelated to the context or documents, you MUST use your general knowledge to answer it. 
- However, if you use your general knowledge, you MUST politely clarify that your answer is based on general knowledge and not from the uploaded documents.
- Always be helpful, friendly, and concise.
"""

        rag_messages = [{"role": "system", "content": system_prompt}] + messages

        async for token in (
            AIService.stream_response(
                messages=rag_messages,
                model=model
            )
        ):
            yield token