from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schema.chat import ChatRequest
from app.services.ollama_services import ChatService
router = APIRouter(
    prefix="/api"
)

@router.post("/chat")
async def chat(request: ChatRequest):
    message = request.message
    model = request.model
   
    return StreamingResponse(
        ChatService.stream_chat(message, model),
        media_type="text/plain"
    )