from app.services.llm.ai_services import AIService


class TitleService:

    @staticmethod
    async def generate_title(
        message: str,
        model:str = "ministral-3:3b-cloud"
    )-> str:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a title generator assistant. "
                    "GENERATE A TITLE BASED ON USER INPUT. IT SHOULD BE SIMPLE, PRECISE, "
                    "AND MEANINGFUL TO DESCRIBE THE MESSAGE. "
                    "Instructions: The title should be a maximum of 5 words."
                     "IMPORTANT: Return ONLY the plain text. Do not use markdown, "
                    "do not use bolding, and do not use asterisks (**) or quotes."
                )
            },
            {
                "role": "user", 
                "content": message
            }
        ]
        
        response = await AIService.generate(
            messages=messages,
            model=model
        )
        
        return response.strip() if response else TitleService.generate_manually(message)

    @staticmethod
    def generate_manually(
        message: str
    ):
        words = message.split()
        return " ".join(words[:5])