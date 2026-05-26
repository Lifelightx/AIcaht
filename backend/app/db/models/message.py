from sqlalchemy import(
    String,
    ForeignKey,
    Text
)
from sqlalchemy.orm import(
    Mapped,
    mapped_column,
    relationship
)

from app.db.base import Base

class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    role: Mapped[str] = mapped_column(
        String
    )
    content: Mapped[str] = mapped_column(
        Text
    )
    chat_id: Mapped[int] = mapped_column(
        ForeignKey("chats.id")
    )
    chat = relationship(
        "Chat",
        back_populates="messages"
    )