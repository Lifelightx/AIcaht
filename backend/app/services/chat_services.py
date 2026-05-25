
from app.factories.factory import ProviderFactory
from app.config.models import MODEL_REGISTRY

class ChatService:
    @staticmethod
    async def stream_chat(message:str, model:str):
        model_config = MODEL_REGISTRY.get(model)
        if not model_config:
            raise ("Model not found")
        provider_name = model_config["provider"]
        actual_model_name = model_config["model_name"]

        provider = ProviderFactory.get_provider(provider_name)

        async for chunk in provider.stream(
        message=message,
        model=actual_model_name
        ):
            yield chunk


