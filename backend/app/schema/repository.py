from pydantic import BaseModel

class RepositoryCreate(BaseModel):
    repository_url: str
    access_token: str | None = None


class RepositorySearchRequest(BaseModel):
    question: str
    limit: int = 10