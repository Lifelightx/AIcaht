import httpx
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

async def stream_response(message:str, model:str):
    payload = {
        "model":model,
        "prompt":message,
        "stream":True
    }


    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream(
            "POST",
            OLLAMA_URL,
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
                    continue
