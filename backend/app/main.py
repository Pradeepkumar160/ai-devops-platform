from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.routes import metrics, alerts, ai

app = FastAPI(
    title="AI DevOps Platform",
    version="1.0.0",
    description="Enterprise AI-Powered Autonomous DevOps & SRE Platform"
)

# Expose /metrics endpoint for Prometheus scraping
Instrumentator().instrument(app).expose(app)

# ── CORS: allow the React frontend on port 4300 ──────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4300",
        "http://localhost:5173",  # vite dev server
        "http://127.0.0.1:4300",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(metrics.router, prefix="/api", tags=["Metrics"])
app.include_router(alerts.router, prefix="/api", tags=["Alerts"])
app.include_router(ai.router, prefix="/api", tags=["AI"])

@app.get("/")
def home():
    return {"status": "AI DevOps Platform Running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
