from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

class ChunkService:

    @staticmethod
    def chunk_text(
        text: str,
        chunk_size: int = 500,
        overlap: int = 100
    ):
        if not text:
            return []
        
        text = text.strip()
        splitter = RecursiveCharacterTextSplitter(
            chunk_size= chunk_size,
            chunk_overlap = overlap,
            separators=[
             "\n\n",
             "\n",
             ". ",
             " ",
             ""
            ]
        )
        chunks = splitter.split_text(text)
        return chunks