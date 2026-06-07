from sqlalchemy import(
    Integer,
    Text,
    String,
    ForeignKey
)


from sqlalchemy.orm import(
    Mapped,
    mapped_column,
    relationship
)

from pgvector.sqlalchemy import Vector
from app.db.base import Base

class RepositoryChunk(Base):
    __tablename__ = "repository_chunks"
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    repository_id: Mapped[int] = mapped_column(
        ForeignKey("repositories.id"),
        index=True
    )
    file_path: Mapped[str] = mapped_column(
        String,
        nullable=False
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )
    start_line: Mapped[int] = mapped_column(
        Integer
    )
    end_line: Mapped[int] = mapped_column(
        Integer
    )
    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(768),
        nullable=True
    ) 
    repository = relationship(
        "Repository",
        back_populates="chunks"
    )