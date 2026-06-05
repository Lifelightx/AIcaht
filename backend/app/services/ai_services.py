
from app.factories.factory import ProviderFactory
from app.config.models import MODEL_REGISTRY, MODEL_REGISTRY_INT
from fastapi import HTTPException
class AIService:
    @staticmethod
    async def stream_response(messages:list, model:str):
        model_config = MODEL_REGISTRY.get(model)
        print("MODEL REQ: ",model,model_config)
        if not model_config:
            raise HTTPException(
                status_code=404,
                detail="Model not found"
            )
        provider_name = model_config["provider"]
        actual_model_name = model_config["model_name"]

        provider = ProviderFactory.get_provider(provider_name)

        async for chunk in provider.stream(
        message=messages,
        model=actual_model_name
        ):
            yield chunk

    async def generate(messages: list, model:str):
        model_config = MODEL_REGISTRY_INT.get(model)
        if not model_config:
            raise HTTPException(
                status_code=404,
                detail="model not found"
            )
        provider_name = model_config["provider"]
        actual_model_name = model_config["model_name"]
        provider = ProviderFactory.get_provider(
            provider_name=provider_name
        )
        return await provider.generate(
            messages=messages,
            model=actual_model_name
        )



