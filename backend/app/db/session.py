import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy.ext.asyncio import(
    create_async_engine,
    async_sessionmaker
)

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://admin:admin123@localhost/chatapp"
)

engine = create_async_engine(
    DATABASE_URL,
    echo=True
)
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False
)
