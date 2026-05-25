from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import all_routers
from contextlib import asynccontextmanager
from app.db.init_db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("starting the application")
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

for routes in all_routers:
    app.include_router(routes)

