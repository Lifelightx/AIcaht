from pydantic import BaseModel
from datetime import datetime
class ChatRequest(BaseModel):
    message: str
    model: str = "qwen2.5"

class ChatResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    


class RenameRequest(BaseModel):
    title: str

