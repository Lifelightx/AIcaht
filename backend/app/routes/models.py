from fastapi import APIRouter
from app.config.models import MODEL_REGISTRY
router = APIRouter(
    prefix="/api"
)

@router.get("/models")
async def listmodels():
    return MODEL_REGISTRY