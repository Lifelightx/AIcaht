# astra ai Chat Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An enterprise-grade, full-stack AI chat application designed for performance, scalability, and an exceptional user experience. astra ai provides a secure, locally-hostable environment for interacting with large language models, featuring integrated Document RAG capabilities and real-time streaming.

## System Architecture Overview

astra ai is built on a modern, decoupled architecture:
- **Backend**: FastAPI (Python) driving high-performance async APIs, WebSockets for streaming, and background task processing for RAG pipelines.
- **Frontend**: React 18 (Vite) offering a highly responsive, premium dark-mode interface with Tailwind CSS.
- **Data Persistence**: PostgreSQL 16 utilizing SQLAlchemy as the ORM, designed for robust relational data mapping and vector storage potential.
- **Infrastructure**: Fully containerized with Docker and Docker Compose, utilizing Nginx as a reverse proxy.

## Core Features

- **Retrieval-Augmented Generation (RAG)**: Users can upload documents (PDF, TXT, CSV, MD) into active chats. The backend asynchronously extracts, chunks, and embeds the text, providing the LLM with localized context for intelligent querying.
- **Real-Time Streaming**: Character-by-character message generation via WebSockets, providing an uninterrupted and fluid user experience.
- **Robust Authentication**: JWT-based secure authentication flow utilizing bcrypt for password hashing and comprehensive frontend route guarding.
- **Advanced UI & Code Rendering**: Comprehensive Markdown parsing including LaTeX mathematical notation support and VS Code Dark+ syntax highlighting for code blocks with one-click clipboard functionality.
- **Dynamic State Management**: Seamless chat creation, renaming, and deletion mechanisms implemented with robust local state handling and backend synchronization.

## Technology Stack

### Backend
* Framework: FastAPI
* Database: PostgreSQL (SQLAlchemy, asyncpg)
* Auth: Passlib, PyJWT
* AI Integration: Local Ollama LLM provider

### Frontend
* Core: React 18, Vite
* Styling: Tailwind CSS, lucide-react
* Markdown & Math: react-markdown, remark-math, rehype-katex, react-syntax-highlighter

## Installation & Setup

### Prerequisites
* Docker & Docker Compose
* Node.js 18+ (for local frontend execution)
* Python 3.10+ (for local backend execution)
* [Ollama](https://ollama.ai/) running locally or accessible via network

### Docker Deployment (Recommended)

1. Clone the repository and navigate to the project root.
2. Configure environment variables in `.env` files.
3. Deploy using Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
4. Access the frontend interface at `http://localhost:80` and API documentation at `http://localhost/api/docs`.

### Local Development

**Backend Setup:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

## Strategic Roadmap

The application architecture supports future scalability. Proposed enterprise features include:
1. **Enhanced Memory Management**: Integration of summarization pipelines to manage long-running context windows efficiently.
2. **Infrastructure Scaling**: Implementation of Redis for semantic caching, rate limiting, and robust session management.
3. **Enterprise Compliance**: OAuth2 SSO integration (Google, GitHub) and Role-Based Access Control (RBAC).
4. **Observability**: Integration of OpenTelemetry and Prometheus for comprehensive system and LLM performance tracking.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
