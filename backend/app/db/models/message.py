from sqlalchemy import(
    String,
    ForeignKey,
    DateTime,
    func,
    Text
)

from datetime import datetime
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
        String(50),
        nullable=False
    )
    content: Mapped[str] = mapped_column(
        Text
    )
    chat_id: Mapped[int] = mapped_column(
        ForeignKey("chats.id")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    chat = relationship(
        "Chat",
        back_populates="messages"
    )