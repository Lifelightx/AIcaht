from pathlib import Path
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.chat import Chat
from app.db.models.document import Document
from .pdf_service import PdfService
from .chunk_service import ChunkService
from app.db.models.document_chunk import DocumentChunk

class DocumentService:

    @staticmethod
    async def has_embedded_documents(
        chat_id: int,
        db:AsyncSession
    ) -> bool:
        querry = select(Document.id).where(
            Document.chat_id == chat_id,
            Document.status == "EMBEDDED"
        )
        result = await db.execute(querry)

        return result.first() is not None

    @staticmethod
    async def upload_document(
        chat_id:int,
        file,
        db: AsyncSession,
        user_id: int
    ):
        query = select(Chat).where(
            Chat.id == chat_id,
            Chat.user_id == user_id
        )

        result = await db.execute(query)
        chat = result.scalar_one_or_none()

        if not chat:
            raise ValueError(
                "chat not found"
            )
        
        UPLOAD_DIR = Path("uploads/pdfs")
        UPLOAD_DIR.mkdir(
            parents=True,
            exist_ok=True
        )
        extension = file.filename.split(".")[-1]
        filename = f"{uuid4()}.{extension}"
        filepath = UPLOAD_DIR / filename

        with open(filepath, "wb") as buffer:
            buffer.write(
                await file.read()
            ) 
        
        pages = PdfService.extract_pages(str(filepath))
        
        document = Document(
            chat_id = chat_id,
            filename = file.filename,
            file_path = str(filepath),
            total_pages = len(pages),
            status = "EXTRACTED"
        )
        db.add(document)
        await db.commit()
        await db.refresh(document)
        print("document status is set now to: ",document.status)
        total_chunks = 0
        for page in pages:
            page_text = PdfService.clean_text(
                page["text"] or ""
            )

            if not page_text.strip():
                continue

            chunks = (
                ChunkService.chunk_text(
                    page_text
                )
            )

            for chunk in chunks:
                document_chunk = (
                    DocumentChunk(
                        document_id=document.id,
                        page_number= page[
                            "page_number"
                        ],
                        content= chunk,
                        embedding= None
                    )
                )
                db.add(document_chunk)
                total_chunks +=1
        
        document.status = "CHUNKED"
        await db.commit()
        print("document status is set now to: ",document.status)
        return {
            "id": document.id,
            "filename": document.filename,
            "total_pages": document.total_pages,
            "total_chunks": total_chunks,
            "status": document.status
        }
    
    @staticmethod
    async def get_chat_document(
        chat_id: int,
        user_id: int,
        db: AsyncSession
    ):
        chat_query = (
            select(Chat).where(
                Chat.id == chat_id,
                Chat.user_id == user_id
            )
        )
        result = await db.execute(chat_query)
        chat = result.scalar_one_or_none()

        if not chat:
            raise ValueError(
                "chat not found"
            )
        query = (
            select(Document).where(
                Document.chat_id == chat_id
            ).order_by(
                Document.created_at.desc()
            )
        )
        result = await db.execute(query)
        documents = result.scalars().all()

        return [
            {
                "id": document.id,
                "filename": document.filename,
                "status": document.status,
                "pages": document.total_pages
            } for document in documents
        ]
    
    @staticmethod
    async def delete_document(
        document_id: int,
        user_id: int,
        db: AsyncSession
    ):
        query = (
             select(Document)
             .join(Chat)
             .where(
                 Document.id == document_id,
                 Chat.user_id == user_id
             )
            )

        result = await db.execute(query)
        document = result.scalar_one_or_none()

        if not document:
            raise ValueError(
                "document not found"
            )
        
        file_path = Path(
             document.file_path
        )
        if file_path.exists():
            file_path.unlink()
        
        await db.delete(document)
        await db.commit()

    @staticmethod
    async def get_document_status(
    document_id: int,
    user_id: int,
    db: AsyncSession
    ):
        query = (
         select(Document)
         .join(Chat)
         .where(
            Document.id == document_id,
            Chat.user_id == user_id
            )
        )

        result = await db.execute(query)

        document = result.scalar_one_or_none()

        if not document:
            raise ValueError(
                "document not found"
            )
        
        return {
         "id": document.id,
         "filename": document.filename,
         "status": document.status
        }