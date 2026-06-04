from pydantic import BaseModel

class DocumentResponse(BaseModel):
    id: int
    filename: str
    status: str
    
    model_config = {
        "from_attributes": True
    }