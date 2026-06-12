from pathlib import Path
import logging

from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

MODEL_NAME = "/app/models/bge-base-en-v1.5"
LOCAL_MODEL_PATH = "/app/models/bge-base-en-v1.5"


class EmbeddingService:
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is not None:
            return cls._model

        logger.info("Loading embedding model...")

        try:
            if Path(LOCAL_MODEL_PATH).exists():
                logger.info(
                    "Loading local model from %s",
                    LOCAL_MODEL_PATH,
                )

                cls._model = SentenceTransformer(
                    LOCAL_MODEL_PATH
                )

            else:
                logger.warning(
                    "Local model not found. Downloading from HuggingFace."
                )

                cls._model = SentenceTransformer(
                    MODEL_NAME,
                    cache_folder="/app/models",
                )

            logger.info("Embedding model loaded.")

            return cls._model

        except Exception:
            logger.exception(
                "Failed to initialize embedding model"
            )
            raise

    @classmethod
    def generate_embeddings(
        cls,
        text: str,
    ) -> list[float]:

        model = cls.get_model()

        return model.encode(
            text,
            normalize_embeddings=True,
            show_progress_bar=False,
        ).tolist()

    @classmethod
    def generate_batch_embeddings(
        cls,
        texts: list[str],
    ) -> list[list[float]]:

        model = cls.get_model()

        embeddings = model.encode(
            texts,
            batch_size=64,
            normalize_embeddings=True,
            show_progress_bar=False,
        )

        return embeddings.tolist()