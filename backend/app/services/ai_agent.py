import os
import httpx

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")


def analyze_logs(logs: str) -> str:
    """
    Analyze Kubernetes logs using Ollama (Llama3).
    Falls back to a structured mock response if Ollama is not reachable.
    """
    prompt = f"""You are an expert Kubernetes Site Reliability Engineer (SRE).
Analyze the following Kubernetes logs and provide:
1. Root Cause - What is causing the problem?
2. Severity - Critical / Warning / Info
3. Suggested Fix - Step-by-step remediation

Logs:
{logs}

Respond in a clear, structured format."""

    try:
        response = httpx.post(
            f"{OLLAMA_HOST}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=60.0,
        )
        response.raise_for_status()
        return response.json().get("response", "No response from AI model.")
    except Exception as e:
        # Fallback: return a structured mock analysis so the platform still works
        return (
            f"[AI Engine Offline - Mock Analysis]\n\n"
            f"Root Cause: Unable to connect to Ollama at {OLLAMA_HOST}. "
            f"Error: {str(e)}\n\n"
            f"Severity: Warning\n\n"
            f"Suggested Fix:\n"
            f"1. Ensure Ollama is installed: https://ollama.com/download\n"
            f"2. Run: ollama serve\n"
            f"3. Pull the model: ollama pull llama3\n"
            f"4. Restart the backend container."
        )


def chat_with_ai(query: str, context: str = "") -> str:
    """
    General-purpose AI chat for infrastructure queries.
    """
    system_context = (
        "You are an expert AI DevOps and SRE assistant. "
        "Help the user with Kubernetes, infrastructure, monitoring, and incident response."
    )
    full_prompt = f"{system_context}\n\nContext: {context}\n\nUser Query: {query}"

    try:
        response = httpx.post(
            f"{OLLAMA_HOST}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": full_prompt, "stream": False},
            timeout=60.0,
        )
        response.raise_for_status()
        return response.json().get("response", "No response from AI model.")
    except Exception as e:
        return (
            f"AI Chat Engine is currently offline (Ollama not reachable).\n"
            f"To enable AI responses:\n"
            f"1. Install Ollama from https://ollama.com/download\n"
            f"2. Run: ollama serve\n"
            f"3. Pull the model: ollama pull llama3\n\n"
            f"Your question was: '{query}'"
        )
