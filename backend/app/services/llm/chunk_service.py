import ast
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    Language
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
    
    @staticmethod
    def chunk_code(
            text: str,
            extension: str = "",
            chunk_size: int = 120
    ):
        if not text:
            return []
        
        if extension == ".py":
            return ChunkService._chunk_python_ast(text, chunk_size)

        ext_to_lang = {
            ".js": Language.JS,
            ".ts": Language.TS,
            ".tsx": Language.TS,
            ".jsx": Language.JS,
            ".java": Language.JAVA,
            ".go": Language.GO,
            ".rs": Language.RUST,
            ".cpp": Language.CPP,
            ".c": Language.CPP,
            ".html": Language.HTML,
            ".md": Language.MARKDOWN,
            ".php": Language.PHP,
            ".rb": Language.RUBY,
        }

        lang = ext_to_lang.get(extension)
        if lang:
            splitter = RecursiveCharacterTextSplitter.from_language(
                language=lang,
                chunk_size=chunk_size * 40,
                chunk_overlap=50
            )
            return splitter.split_text(text)
        
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

    @staticmethod
    def _chunk_python_ast(text: str, fallback_chunk_size: int):
        try:
            tree = ast.parse(text)
        except SyntaxError:
            lines = text.splitlines()
            return [
                "\n".join(lines[i:i+fallback_chunk_size]) 
                for i in range(0, len(lines), fallback_chunk_size)
            ]
        
        chunks = []
        current_chunk = []
        lines = text.splitlines()
        
        def flush():
            if current_chunk:
                chunks.append("\n".join(current_chunk))
                current_chunk.clear()

        def get_source(node):
            if hasattr(node, 'decorator_list') and node.decorator_list:
                start_line = node.decorator_list[0].lineno
            else:
                start_line = node.lineno
            end_line = getattr(node, 'end_lineno', node.lineno)
            return "\n".join(lines[start_line-1:end_line])

        for node in tree.body:
            if isinstance(node, ast.ClassDef):
                flush()
                class_prefix = f"class {node.name}:"
                for body_node in node.body:
                    if isinstance(body_node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        source = get_source(body_node)
                        if source:
                            chunks.append(f"{class_prefix}\n{source}")
                    else:
                        source = get_source(body_node)
                        if source:
                            current_chunk.append(source)
                flush()
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                flush()
                source = get_source(node)
                if source:
                    chunks.append(source)
            else:
                source = get_source(node)
                if source:
                    current_chunk.append(source)
        flush()
        return chunks