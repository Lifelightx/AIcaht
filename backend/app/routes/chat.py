from fastapi import APIRouter

from fastapi.responses import StreamingResponse

from app.schema.chat import ChatRequest
from app.services.ollama_services import stream_response

router = APIRouter(
    prefix="/api"
)

@router.post("/chat")
async def chat(request: ChatRequest):
    async def generate():
        async for chunk in stream_response(
        request.message,
        request.model
        ):
            yield chunk
    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )