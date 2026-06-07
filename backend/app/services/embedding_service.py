from sentence_transformers import (
    SentenceTransformer
)

class EmbeddingService:
    _model = None

    @staticmethod
    def get_model():
        if EmbeddingService._model is None:
            print(
                "loading embedding model..."
            )
            EmbeddingService._model = (
                SentenceTransformer(
                    "BAAI/bge-base-en-v1.5"
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
    
    @staticmethod
    def generate_batch_embeddings(
        texts: list[str]
    ) -> list[list[float]]:

        model = (
            EmbeddingService.get_model()
        )

        embeddings = model.encode(
            texts,
            batch_size=64,
            normalize_embeddings=True
        )

        return embeddings.tolist()