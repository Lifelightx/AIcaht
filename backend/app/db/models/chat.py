from sqlalchemy import (
    String,
    ForeignKey)

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
    tittle: Mapped[str] = mapped_column(
        String
    ) 
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )
    user = relationship(
        "User",
        back_populates="chats"
    )
    messages = relationship(
        "Message",
        back_populates="chat"
    )