# AI Chat Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An enterprise-ready, GitHub-themed AI chat platform designed for performance, scalability, and an exceptional user experience.

## 🚀 Overview

This repository contains a full-stack AI Chat Application featuring a robust FastAPI backend communicating with an Ollama LLM provider, and a sleek, responsive React frontend powered by Vite and Tailwind CSS. The system is fully containerized using Docker Compose for seamless development and deployment.

### 🛠 Tech Stack

**Frontend:**
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (GitHub-themed UI, Dark/Light modes)
- **Routing:** React Router DOM
- **Features:** Markdown rendering, responsive design, active streaming UI

**Backend:**
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL with SQLAlchemy & asyncpg
- **Authentication:** JWT, bcrypt (Passlib)
- **AI Integration:** Ollama (Local/Self-hosted LLMs)
- **Real-time:** WebSockets for chat streaming

**Infrastructure:**
- **Containerization:** Docker & Docker Compose
- **Reverse Proxy:** Nginx
- **Database:** PostgreSQL 16

---

## 🏗 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local frontend development)
- Python 3.10+ (for local backend development)
- [Ollama](https://ollama.ai/) running locally or accessible via network.

### Running with Docker (Recommended)

1. **Configure Environment:**
   Ensure your `.env` files are configured appropriately (you may need to create them based on the repository defaults).

2. **Start the Application:**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the Application:**
   - **Frontend UI:** `http://localhost:80` (or `http://localhost:8080`)
   - **Backend API Docs:** `http://localhost/api/docs`

### Local Development

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Set environment variables (DATABASE_URL, etc.)
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## ✨ Current Features

- **Secure Authentication:** Complete sign-up and login flow with JWT-based route guarding.
- **Dynamic UI:** Premium GitHub-styled interface with collapsible sidebars and responsive auto-resizing textareas.
- **Streaming Responses:** Real-time character-by-character message streaming from the AI.
- **Theme Support:** Fully functional Light and Dark modes.
- **Markdown Support:** Renders code blocks, tables, and standard markdown in the chat interface.

---

## 🚀 Roadmap & Advanced Features (Proposed)

As the application scales, the following enterprise-grade features are recommended for implementation to elevate the product from a minimum viable product to a market-leading solution:

### 1. Advanced AI Capabilities (RAG & Memory)
- **Document Chat (RAG):** Integrate `pgvector` into PostgreSQL to allow users to upload PDFs/Docs and chat with their proprietary data.
- **Long-term Conversation Memory:** Implement summarization pipelines that compress older messages to maintain context without exhausting the LLM's context window.
- **Multi-Modal Support:** Add the ability to paste images for vision-capable models (like LLaVA via Ollama).

### 2. Performance & Scalability Infrastructure
- **Redis Caching & Queueing:** Introduce Redis for rate limiting, session storage, and semantic caching (caching identical prompt responses).
- **Background Workers:** Use Celery or FastAPI Background Tasks for heavy operations like sending welcome emails or processing uploaded documents.
- **Streaming Optimizations:** Implement Server-Sent Events (SSE) or optimized WebSockets for more resilient mobile connections.

### 3. Enterprise Security & Compliance
- **OAuth2 / SSO Integration:** Allow login via GitHub, Google, or Microsoft to reduce friction.
- **Role-Based Access Control (RBAC):** Differentiate between Free, Pro, and Admin users with corresponding API limit tiers.
- **Data Privacy & E2E Encryption:** Add options for ephemeral chats (not saved to DB) or encrypted-at-rest chat logs.

### 4. Observability & Analytics
- **Distributed Tracing & Metrics:** Integrate OpenTelemetry, Prometheus, and Grafana to track LLM latency, token usage, and API performance.
- **User Analytics:** Implement product analytics (e.g., PostHog) to track feature usage and user retention.

### 5. Collaborative & Productivity Features
- **Conversation Branching:** Allow users to "branch" a conversation from a specific message, similar to version control for thoughts.
- **Export Capabilities:** 1-click export of chat threads to Markdown, PDF, or directly to a GitHub Gist.
- **Prompt Library:** A built-in repository of user-saved or system-provided system prompts.

---
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Architected and maintained by Jeeban with ❤️.*
