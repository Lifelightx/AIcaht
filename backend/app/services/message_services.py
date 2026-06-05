from fastapi import (
    HTTPException,
    status
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.chat import Chat 
from app.db.models.message import Message

import json
from app.services.ai_services import AIService
from .router_service import RouterService
from .search_service import SearchService
from .document_service import DocumentService
from .rag_service import RagService
from app.services.title_service import TitleService
from app.config.keyword import keyword_search
class MessageService:

    @staticmethod
    async def create_and_stream_chat(
    db: AsyncSession,
    user_id: int,
    message: str,
    model: str
):
     generated_title = TitleService.generate_title(message=message)
     chat = Chat(
         title= generated_title,
         user_id= user_id
     )
     db.add(chat)
     await db.commit()
     await db.refresh(chat)
     yield f"event: chat_id\ndata: {chat.id}\n\n"

     user_message = Message(
         chat_id = chat.id,
         role = "user",
         content = message
     )
     db.add(user_message)
     await db.commit()
     formatted_messages = [
         {
            "role": "user",
            "content": message
        }
     ]
     has_documents = await(
         DocumentService.has_embedded_documents(
             chat_id=chat.id,
             db=db
         )
     )
     print("has_documents:", has_documents)

     
     full_response = ""

     if has_documents:
         print("Using rag pipline")
         stream = (
             RagService.stream_answer(
                 chat_id=chat.id,
                 question=message,
                 db=db,
                 model=model
             )
         )
     else:
        print(
            "Using normal chat"
        )
        needs_internet = (
            keyword_search(message)
            or await RouterService.needs_internet(message)
        )
        if needs_internet:
            search_result = await SearchService.internet_search(
                message
            )
            formatted_messages.append({
                "role":"system",
                "content":f"""
                        use the following internet information.
                        {search_result}
                        Answer using these results.
                        """
            })

        stream = (
            AIService.stream_response(
            messages=formatted_messages,
            model=model
            )
        )
        
     async for chunk in stream:
        full_response += chunk
        yield f"data: {json.dumps(chunk)}\n\n"
    

     assistant_message = Message(
        chat_id=chat.id,
        role="assistant",
        content=full_response
    )
     db.add(assistant_message)
     await db.commit()

    
    @staticmethod
    async def get_chat_message(
        db: AsyncSession,
        chat_id: int,
        user_id: int
    ):
        chat_query = select(Chat).where(
            Chat.id == chat_id,
            Chat.user_id == user_id
        )
        result = await db.execute(chat_query)
        chat = result.scalar_one_or_none()
        if not chat:
            raise HTTPException(
                status_code= status.HTTP_404_NOT_FOUND,
                detail="Chat not found"
            )
        message_query = (
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.asc())
        )
        message_result = await db.execute(message_query)

        return message_result.scalars().all()
    
    @staticmethod
    async def stream_message(
        db: AsyncSession,
        chat_id: int,
        user_id: int,
        message: str,
        model: str
    ):
        query = select(Chat).where(
            Chat.id == chat_id,
            Chat.user_id == user_id
        )
        result = await db.execute(query)
        chat = result.scalar_one_or_none()
        if not chat:
            raise HTTPException(
                status_code= status.HTTP_404_NOT_FOUND,
                detail="chat not found"
            )
        user_messages = Message(
            chat_id=chat_id,
            role="user",
            content=message
        )
        db.add(user_messages)
        await db.commit()
        history_query = (
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.asc())
        )
        history_result = await db.execute(history_query)
        history = history_result.scalars().all()
        history = history[-15:]
        formatted_messages = [
            {
                "role":msg.role,
                "content": msg.content
            }
            for msg in history
        ]
        
       
        
        has_documents = await(
         DocumentService.has_embedded_documents(
             chat_id=chat_id,
             db=db
            )
        )
        print("has_documents:", has_documents)

        if chat.title == "New chat":
            generated_title = TitleService.generate_title(message)
            chat.title = generated_title
            await db.commit()
        

        full_response = ""
        if has_documents:
            print("Using rag pipline")
            stream = (
                RagService.stream_answer(
                 chat_id=chat.id,
                 question=message,
                 db=db,
                 model=model
                )
            )
        else:
            print("Using normal pipline")
            needs_internet = (
            keyword_search(message) or
        await RouterService.needs_internet(message)
        )
            print("needs_internet_result from msg_service: ", needs_internet)
            
            if needs_internet:
                search_result = await SearchService.internet_search(
                     message
                )
                print(search_result)
                formatted_messages.append({
                 "role":"system",
                 "content":f"""
                        use the following internet information.
                        {search_result}
                        Answer using these results.
                        Instructions:
                        - Use only factual information.
                        - Ignore speculative articles.
                        - Prefer official sources.
                        - Prefer Wikipedia and government websites.
                        - If search results disagree, mention uncertainty.
                        - Do not invent facts.
                        """
                })

            stream = (
                AIService.stream_response(
                    messages=formatted_messages,
                    model=model
                )
            )
        
        async for chunk in stream:
            full_response +=chunk
            yield f"data: {json.dumps(chunk)}\n\n"
        
        if full_response.strip():
            assistant_message = Message(
            chat_id=chat_id,
            role="assistant",
            content=full_response
         )
        db.add(assistant_message)
        await db.commit()

        
