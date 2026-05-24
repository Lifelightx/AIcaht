from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router
from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from contextlib import asynccontextmanager
from app.db.init_db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("stating the application")
    await init_db()
    yield
    print("sutting down the application")

app = FastAPI(
    title="Local AI chat bot",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(health_router)
app.include_router(auth_router)