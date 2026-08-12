# ⚡ AI DevOps Platform.

> **Enterprise-Grade Autonomous DevOps & SRE Platform** powered by LLM, real-time monitoring, and self-healing infrastructure.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)

---

## 🚀 Features

- 🤖 **AI Chat Assistant** — Ask infrastructure questions in natural language, powered by Llama3/TinyLlama via Ollama
- 📊 **Real-time Monitoring** — Live CPU, memory, network, and pod health metrics from Prometheus
- 📈 **Grafana Dashboards** — Beautiful visualizations with auto-provisioned datasources
- 🚨 **Alert Management** — View, dismiss, and investigate alerts with AI-assisted root cause analysis
- 🔁 **Auto-healing** — Automated incident response and remediation suggestions
- 🐳 **Fully Containerized** — One-command setup with Docker Compose

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Docker Network                     │
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐  │
│  │  React   │───▶│ FastAPI  │───▶│  Prometheus  │  │
│  │ Frontend │    │ Backend  │    │   :9090      │  │
│  │  :4300   │    │  :8000   │    └──────┬───────┘  │
│  └──────────┘    └────┬─────┘           │          │
│                       │            ┌────▼──────┐   │
│                       │            │  Grafana  │   │
│                  ┌────▼─────┐      │   :3000   │   │
│                  │  Ollama  │      └───────────┘   │
│                  │ (host)   │                       │
│                  │ :11434   │                       │
│                  └──────────┘                       │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Recharts |
| Backend | FastAPI, Python 3.11, Uvicorn |
| AI Engine | Ollama, Llama3 / TinyLlama |
| Monitoring | Prometheus, Node Exporter |
| Visualization | Grafana |
| Containerization | Docker, Docker Compose |
| HTTP Client | Axios, HTTPX |

---

## ⚙️ Quick Setup

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Ollama](https://ollama.com/download)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/Pradeepkumar160/ai-devops-platform.git
cd ai-devops-platform
```

### 2. Start Ollama and pull the model
```bash
ollama serve         # skip if already running
ollama pull tinyllama
```

### 3. Start all containers
```bash
docker compose up -d --build
```

### 4. Open the platform
| Service | URL |
|---|---|
| 🖥️ Dashboard | http://localhost:4300 |
| ⚡ Backend API | http://localhost:8100/docs |
| 📊 Prometheus | http://localhost:9095 |
| 📈 Grafana | http://localhost:3100 (admin / devops123) |

---

## 📁 Project Structure

```
ai-devops-platform/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py           # App entry point + Prometheus metrics
│   │   ├── routes/           # API routes (metrics, alerts, AI chat)
│   │   └── services/         # AI agent, auto-healing, Slack, PDF
│   └── Dockerfile
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Dashboard, Alerts, AI Assistant
│   │   └── services/api.js   # Axios API client
│   └── Dockerfile
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml    # Scrape configs
│   └── grafana/
│       └── datasources/      # Auto-provisioned Prometheus datasource
├── kubernetes/               # K8s deployment manifests
└── docker-compose.yml
```

---

## 🤖 AI Assistant

The AI Assistant uses **Ollama** to run LLMs locally — no API keys, no cloud costs.

**Example queries:**
- *"Why would a Kubernetes pod keep restarting?"*
- *"How do I debug high memory usage in a container?"*
- *"What does OOMKilled mean and how do I fix it?"*

---

## 📊 Monitoring Stack

- **Prometheus** scrapes metrics from the FastAPI backend every 15s
- **Grafana** visualizes metrics with pre-built dashboards
- Import dashboard ID **`1860`** in Grafana for Node Exporter Full dashboard

---

## 👨‍💻 Author

**Pradeepkumar** — [@Pradeepkumar160](https://github.com/Pradeepkumar160)

---

## 📄 License

MIT License — feel free to use this for your own projects!
