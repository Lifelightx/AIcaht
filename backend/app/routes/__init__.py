from app.routes.auth import router as auth_router
from app.routes.chat import router as chat_router
from app.routes.health import router as health_router
from app.routes.models import router as model_router

all_routers = [
    auth_router,
    chat_router,
    health_router,
    model_router
]