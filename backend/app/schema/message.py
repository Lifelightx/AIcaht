from pydantic import BaseModel
from datetime import datetime

class MessageRequest(BaseModel):
    message: str
    model: str = "qwen2.5"

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    model_config ={
        "from_attributes":True
    }
