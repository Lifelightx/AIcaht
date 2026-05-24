from app.providers.ollama import OllamaProvider

class ProviderFactory:
    @staticmethod
    def get_providers(provider_name: str):    
        providers ={
            "ollama": OllamaProvider()
        }
        return providers[provider_name]