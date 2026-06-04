from sqlalchemy import(
    Text,
    ForeignKey,
    Integer
)


from sqlalchemy.orm import(
    mapped_column,
    Mapped,
    relationship
)

from pgvector.sqlalchemy import Vector
from app.db.base import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id"),
        index=True
    )
    page_number: Mapped[int] = mapped_column(
        Integer
    )
    content: Mapped[str] = mapped_column(
        Text
    )
    embedding: Mapped[list[float]] = mapped_column(
        Vector(384),
        nullable= True
    )
    document = relationship(
        "Document",
        back_populates="chunks"
    )