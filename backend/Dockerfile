FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    git \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Cache pip downloads to speed up dependency installation
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir -r requirements.txt

# HuggingFace cache location
ENV HF_HOME=/app/models
ENV TRANSFORMERS_CACHE=/app/models

# Pre-download model during build using BuildKit cache mount
RUN --mount=type=cache,target=/app/models \
    python -c "\
from sentence_transformers import SentenceTransformer; \
SentenceTransformer('BAAI/bge-base-en-v1.5').save('/app/models/bge-base-en-v1.5')"

COPY ./app ./app

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
