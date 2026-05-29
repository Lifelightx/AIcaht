from datetime import(
    timedelta,
    datetime,
    timezone
)

import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
SECRET_KEY = "Admkh&6c$werfghjRFGBUHGRFvfghjuyfdvb"
ALGORITHM = "HS256"

def create_token(data: dict):
    payload = data.copy()
    expires = datetime.now(timezone.utc)+timedelta(days=30)
    payload.update({"exp":expires})
    return jwt.encode(payload, SECRET_KEY, ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        print("Token expired")
        return None

    except InvalidTokenError:
        print("Token is not valid")
        return None 