from datetime import datetime
from sqlalchemy import(
    String,
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

class Repository(Base):
    __tablename__ = "repositories"
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    chat_id: Mapped[int] = mapped_column(
        ForeignKey("chats.id"),
        index=True
    )
    name: Mapped[str] = mapped_column(
        String,
        nullable=False
    )
    repository_url: Mapped[str] = mapped_column(
        String,
        nullable=False
    )
    local_path: Mapped[str] = mapped_column(
        String,
        nullable=False
    )
    status: Mapped[str] = mapped_column(
        String,
        default="PENDING"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )
    provider: Mapped[str] = mapped_column(
        String,
        default="github"
    )
    chat = relationship(
        "Chat",
        back_populates="repositories"
    )
    chunks = relationship(
        "RepositoryChunk",
        back_populates="repository",
        cascade="all, delete-orphan"
    )