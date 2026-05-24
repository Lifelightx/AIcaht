from abc import ABC, abstractmethod



class BaseProvider(ABC):
    
    @abstractmethod
    async def stream(self, message:str, model:str):
        pass