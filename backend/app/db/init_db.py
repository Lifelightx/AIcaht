from app.db.session import engine
from app.db.base import Base

# import all models
from app.db.models import models

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(
            Base.metadata.create_all
        )