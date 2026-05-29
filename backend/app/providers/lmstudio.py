import httpx
import json
import os
from .base import BaseProvider

LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"


class LMStudioProvider(BaseProvider):
    async def stream(self, message, model):
        payload = {
            "model": model,
            "messages": message,
            "stream": True,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient(timeout=None) as client:

            async with client.stream(
                "POST",
                LM_STUDIO_URL,
                json=payload
            ) as response:

                print("STATUS:", response.status_code)
                if response.status_code != 200:
                    print(await response.aread())
                    return

                async for line in response.aiter_lines():

                    if not line:
                        continue

                    if line.startswith("data: "):
                        line = line[6:]

                    if line == "[DONE]":
                        break

                    try:
                        data = json.loads(line)
                        choices = data.get("choices", [])

                        if choices:
                            delta = choices[0].get("delta", {})
                            content = delta.get("content")

                            if content:
                                yield content

                    except Exception as e:
                        print(e)
                        print("raw line:", line)
