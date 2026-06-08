from app.services.repository_retrieval import (
    RepositoryRetrievalService
)

from app.services.ai_services import (
    AIService
)


class RepositoryRagService:

    @staticmethod
    async def stream_answer(
        repository_id: int,
        question: str,
        messages: list,
        model: str,
        db
    ):

        chunks = await (
            RepositoryRetrievalService
            .retrieve_chunks(
                repository_id=repository_id,
                question=question,
                db=db,
                limit=15
            )
        )

        context = "\n\n".join([
            f"""
File: {chunk.file_path}
Lines: {chunk.start_line}-{chunk.end_line}

{chunk.content}
            """
            for chunk in chunks
        ])

        system_prompt = f"""
You are a senior software engineer.

Use ONLY the repository context.

Rules:

- Do not invent code.
- Do not assume files exist.
- Mention file paths when possible.
- Mention line numbers when relevant.
- If the answer is not present in the context,
  explicitly say so.

Repository Context:

{context}
"""

        rag_messages = [
            {
                "role": "system",
                "content": system_prompt
            }
        ] + messages

        async for chunk in (
            AIService.stream_response(
                messages=rag_messages,
                model=model
            )
        ):
            yield chunk