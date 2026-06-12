FROM python:3.13-slim

WORKDIR /app

# Install standard Linux utilities
RUN apt-get update && apt-get install -y \
    git \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .

# ✅ FIXED: Corrected index URL to the official PyTorch CPU wheel repo
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# 1. COPY THE LOCAL MODEL INTO THE IMAGE
# This bakes the downloaded model straight into your Docker image layer
COPY ./models/bge-base-en-v1.5 /app/models/bge-base-en-v1.5

# 2. Copy application code
COPY ./app ./app

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
