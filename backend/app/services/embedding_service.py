from sentence_transformers import (
    SentenceTransformer
)

class EmbeddingService:
    _model = None

    @staticmethod
    def get_model():
        if EmbeddingService._model in None:
            print(
                "loading embedding model..."
            )
            EmbeddingService._model = (
                SentenceTransformer(
                    "all-MiniLM-L6-v2"
                )
            )
        return EmbeddingService._model

    @staticmethod
    def generate_embeddings(
        text: str
    )-> list[float]:
        model = EmbeddingService.get_model()
        return (
            model.encode(
                text,
                normalize_embeddings=True
            ).tolist()
        )