from app.services.ai_services import AIService


class RouterService:

    @staticmethod
    async def needs_internet(
        message: str,
        model:str = "ministral-3:3b-cloud"
    )-> bool:
        messages = [
            {
                "role": "system",
                "content": """
                You are a routing assistant.

                Determine whether the user's question requires
                current or real-time information from the internet.

                Respond with ONLY one word:

                YES

                or

                NO
            """
            },
            {
                "role": "user",
                "content": message
            }
        ]
        print(messages)
        response = await AIService.generate(
            messages=messages,
            model=model
        )
        response = response.strip().upper()
        return response.startswith("YES")

