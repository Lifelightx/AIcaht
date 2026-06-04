from app.db.models.user import User
from app.db.models.chat import Chat
from app.db.models.message import Message
from .document import Document
from .document_chunk import DocumentChunk
models = [
    User,
    Chat,
    Message,
    Document,
    DocumentChunk
]

