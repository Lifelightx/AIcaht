from sqlalchemy import (
    String,
    DateTime,
    func,
    ForeignKey)
from datetime import datetime
from sqlalchemy.orm import(
    Mapped,
    mapped_column,
    relationship
)

from app.db.base import Base

class Chat(Base):
    __tablename__ = "chats"
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    title: Mapped[str] = mapped_column(
        String,
        default="New chat"
    ) 
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )
    user = relationship(
        "User",
        back_populates="chats"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    messages = relationship(
        "Message",
        back_populates="chat",
        cascade="all, delete-orphan"
    )
    documents = relationship(
    "Document",
    back_populates="chat",
    cascade="all, delete-orphan"
    )
