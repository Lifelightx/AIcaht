from datetime import datetime

from sqlalchemy import(
    String,
    Integer,
    DateTime,
    ForeignKey,
    func
)
from sqlalchemy.orm import(
    Mapped,
    mapped_column,
    relationship
)

from app.db.base import Base

class Document(Base):
    __tablename__ = "documents"
    
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    chat_id: Mapped[int] = mapped_column(
        ForeignKey("chats.id"),
        index= True
    )

    filename: Mapped[str] = mapped_column(
        String,
        nullable= False
    )
    file_path: Mapped[str] = mapped_column(
        String,
        nullable=False
    )
    total_pages: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )
    status: Mapped[str] = mapped_column(
        String,
        default="PROCESSING"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default= func.now()
    )
    chat = relationship(
        "Chat",
        back_populates="documents"
    )
    chunks = relationship(
        "DocumentChunk",
        back_populates="document",
        cascade="all, delete-orphan"
    )
