

class TitleService:
    @staticmethod
    def generate_title(message:str):
         words = message.split()
         return " ".join(words[:5])