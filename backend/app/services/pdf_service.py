from pypdf import PdfReader
import re

class PdfService:

    @staticmethod
    def extract_pages(filepath: str):

        reader = PdfReader(filepath)

        pages = []
        for page_number, page in enumerate(
            reader.pages,
            start=1
        ):
            text = page.extract_text() or ""
            pages.append({
                "page_number":page_number,
                "text" : text
            })
        
        return pages

    @staticmethod
    def clean_text(text: str):
        text = re.sub(
            r"\s+",
            " ",
            text
        )
        return text.strip()