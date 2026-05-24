
import httpx
import json
from dotenv import load_dotenv
from .base import BaseProvider
import os
load_dotenv()
OLLAMA_URL = os.getenv("OLLAMA_HOST")+"/api/generate"

class OllamaProvider(BaseProvider):
    async def stream(self, message, model):
        payload = {
            "model": model,
            "prompt": message,
            "stream":True
        }
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                method="POST",
                url=OLLAMA_URL,
                json=payload
            ) as response:
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    try:
                        data = json.loads(line)
                        token = data.get("response", "")
                        if token:
                            yield token
                    except Exception as e:
                        print(e)