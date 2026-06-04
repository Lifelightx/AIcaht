from fastapi import HTTPException
from app.db.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.auth import (SignupSchema, LoginSchema)
from sqlalchemy import select
from app.utils.password_hasing import hash_password, verify_password
from app.utils.jwt_handler import create_token
class AuthService:
    @staticmethod
    async def create_user(data:SignupSchema , db: AsyncSession):
        querry = select(User).where(
            User.email == data.email
        )
        result = await db.execute(querry)
        existing_user = result.scalar_one_or_none()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="user already exists"
            )
        user = User(
            name = data.name,
            email = data.email,
            password = hash_password(data.password)
        )
        db.add(user)
        await db.commit()
        return {
            "data": user,
            "message": "user created sucessfully"
        }
    @staticmethod
    async def login_user(data: LoginSchema, db : AsyncSession):
        query = select(User).where(
            User.email == data.email
        )
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=401,
                detail="invalid email or password"
            )
        check_password = verify_password(data.password, user.password)

        if not check_password:
            raise HTTPException(
                status_code=401,
                detail="invalid email or password"
            )
        access_token = create_token({
            "sub": str(user.id),
            "email": user.email
        })
        return {
            "token": access_token,
            "token_type": "bearer"
        }
    

    @staticmethod
    async def update_user():
        pass