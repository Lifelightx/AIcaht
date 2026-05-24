
from app.factories.factory import ProviderFactory


class ChatService:
    @staticmethod
    async def stream_chat(message:str, model:str):
        provider = ProviderFactory.get_providers("ollama")
        async for chunk in provider.stream(
        message=message,
        model=model
        ):
            yield chunk


