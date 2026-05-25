from app.providers.ollama import OllamaProvider
from app.providers.lmstudio import LMStudioProvider
class ProviderFactory:
    @staticmethod
    def get_provider(provider_name: str):    
        providers ={
            "ollama": OllamaProvider(),
            "lmstudio": LMStudioProvider()
        }
        return providers[provider_name]