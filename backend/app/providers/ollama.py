
import httpx
import json
from dotenv import load_dotenv
from .base import BaseProvider
import os
load_dotenv()
OLLAMA_URL = os.getenv("OLLAMA_HOST")+"/api/chat"

class OllamaProvider(BaseProvider):
    async def stream(self, message, model):
        
        payload = {
            "model": model,
            "messages": message,
            "stream":True
        }
        # print(payload)
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                method="POST",
                url=OLLAMA_URL,
                json=payload
            ) as response:
                print("STATUS:", response.status_code)
                if response.status_code != 200:
                     print(await response.aread())
                     return
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    # print(line)
                    try:
                        data = json.loads(line)
                        token = data.get("message", {}).get("content", "")
                        if token:
                            yield token
                    except Exception as e:
                        print(e)