from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    model: str = "qwen2.5"

class ChatResponse(BaseModel):
    response: str