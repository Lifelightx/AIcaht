from fastapi import (
    APIRouter,
    Depends,
    
)
from app.schema.auth import (
    SignupSchema,
    LoginSchema
)
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.dependency import get_db
from app.services.auth_services import AuthService
router = APIRouter(
    prefix="/api/auth"
)


@router.post("/signup", status_code=201)
async def signup(
    request: SignupSchema,
    db: AsyncSession = Depends(get_db)
    ):

    return await AuthService.create_user(
        data=request, db=db
    )

@router.post("/login")
async def login(request: LoginSchema, db: AsyncSession = Depends(get_db)):
    return await AuthService.login_user(data=request, db=db)