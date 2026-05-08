from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.services.ai_agent import analyze_logs

router = APIRouter()

# In-memory alert store (replace with Redis/DB in production)
alerts_store = [
    {
        "id": 1,
        "severity": "critical",
        "title": "High CPU Usage on Pod-1",
        "message": "CPU usage exceeded 90% threshold",
        "timestamp": "2024-01-15 14:32:00",
        "resolved": False,
    },
    {
        "id": 2,
        "severity": "warning",
        "title": "Memory Pressure Detected",
        "message": "Memory usage at 75% on node-2",
        "timestamp": "2024-01-15 14:28:00",
        "resolved": False,
    },
    {
        "id": 3,
        "severity": "info",
        "title": "Deployment Updated",
        "message": "Frontend deployment rolled out successfully",
        "timestamp": "2024-01-15 14:15:00",
        "resolved": True,
    },
]


class AlertTriggerRequest(BaseModel):
    logs: str
    severity: Optional[str] = "warning"
    title: Optional[str] = "New Alert"


@router.get("/alerts")
def get_alerts():
    return {"alerts": alerts_store, "total": len(alerts_store)}


@router.post("/alerts/trigger_ai_analysis")
def trigger_ai_analysis(request: AlertTriggerRequest):
    analysis = analyze_logs(request.logs)
    new_alert = {
        "id": len(alerts_store) + 1,
        "severity": request.severity,
        "title": request.title,
        "message": f"AI Analysis: {analysis[:200]}...",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "resolved": False,
        "full_analysis": analysis,
    }
    alerts_store.append(new_alert)
    return {"message": "AI analysis complete", "alert": new_alert}


@router.delete("/alerts/{alert_id}")
def dismiss_alert(alert_id: int):
    for alert in alerts_store:
        if alert["id"] == alert_id:
            alert["resolved"] = True
            return {"message": f"Alert {alert_id} dismissed"}
    return {"message": "Alert not found"}
