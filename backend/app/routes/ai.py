from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_agent import analyze_logs, chat_with_ai

router = APIRouter()


class LogAnalysisRequest(BaseModel):
    logs: str


class ChatRequest(BaseModel):
    query: str
    context: str = ""


@router.post("/analyze_logs")
def analyze_kubernetes_logs(request: LogAnalysisRequest):
    """Analyze Kubernetes logs using the AI engine."""
    response = analyze_logs(request.logs)
    return {"analysis": response}


@router.post("/chat")
def chat_endpoint(request: ChatRequest):
    """AI Chat Assistant endpoint."""
    response = chat_with_ai(request.query, request.context)
    return {"response": response, "query": request.query}


@router.get("/chat")
def chat_get(query: str):
    """AI Chat Assistant - GET version for simple queries."""
    response = chat_with_ai(query)
    return {"response": response}
