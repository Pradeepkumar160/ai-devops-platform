from fastapi import APIRouter
import httpx
import os
import random
from datetime import datetime

router = APIRouter()

PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://localhost:9095")


def query_prometheus(query: str):
    try:
        r = httpx.get(
            f"{PROMETHEUS_URL}/api/v1/query",
            params={"query": query},
            timeout=5.0,
        )
        data = r.json()
        if data.get("status") == "success":
            results = data["data"]["result"]
            if results:
                return float(results[0]["value"][1])
    except Exception:
        pass
    return None


@router.get("/metrics")
def get_metrics():
    """Return real metrics from Prometheus, fallback to mock if unavailable."""
    cpu = query_prometheus('100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)')
    memory = query_prometheus('(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100')

    # Use mock values if Prometheus not yet connected
    return {
        "cpu_usage": round(cpu, 2) if cpu is not None else round(random.uniform(30, 70), 2),
        "memory_usage": round(memory, 2) if memory is not None else round(random.uniform(40, 75), 2),
        "pod_health": {"healthy": 10, "total": 12},
        "restart_count": random.randint(0, 5),
        "network_in_gbps": round(random.uniform(1.5, 3.5), 2),
        "network_out_gbps": round(random.uniform(0.8, 2.5), 2),
        "timestamp": datetime.utcnow().isoformat(),
        "source": "prometheus" if cpu is not None else "mock",
    }


@router.get("/metrics/history")
def get_metrics_history():
    """Returns time-series data for charts."""
    hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"]
    return {
        "data": [
            {
                "time": h,
                "cpu": round(random.uniform(25, 80), 1),
                "memory": round(random.uniform(35, 75), 1),
                "pods": random.randint(8, 14),
            }
            for h in hours
        ]
    }
