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
    
    def chunk_code(
            text: str,
            chunk_size: int = 120
    ):
        if not text:
            return []
        
        lines = text.splitlines()
        
        chunks = []

        for i in range(
            0,
            len(lines),
            chunk_size
        ):
            chunks.append(
                "\n".join(
                    lines[i:i+chunk_size]
                )
            )
        
        return chunks