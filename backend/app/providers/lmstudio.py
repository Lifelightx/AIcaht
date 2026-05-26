import httpx
import json
import os
from .base import BaseProvider

LM_STUDIO_URL = "http://localhost:1234/api/v1/chat"


class LMStudioProvider(BaseProvider):
    async def stream(self, message, model):
        payload ={
            "model":model,
            "input": message,
            "stream": True,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient(
            timeout=None
        ) as client:
            async with client.stream(
                url=LM_STUDIO_URL,
                method="POST",
                json=payload
            ) as response:
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    
                    if line.startswith("event: "):
                        continue
                    if line.startswith("data: "):
                        print(line)
                        line = line.replace(
                            "data: ",
                            ""
                        )
                    if line == "[DONE]":
                        break
                    try:
                        data = json.loads(line)
                        if data.get("type") == "message.delta":
                            content = data.get("content", "")
                            if content:
                                yield content
                    except Exception as e:
                        print(e)
                        print("raw line: ", line)


