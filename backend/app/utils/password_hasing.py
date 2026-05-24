import bcrypt

def hash_password(password: str):
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()

    return bcrypt.hashpw(password_bytes, salt).decode("utf-8")

def verify_password(plain_password: str, hash_password: str):
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hash_password.encode("utf-8")
    )