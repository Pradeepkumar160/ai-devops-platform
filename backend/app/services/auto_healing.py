import subprocess
import os


def restart_deployment(name: str, namespace: str = "ai-devops") -> dict:
    """
    Restart a Kubernetes deployment.
    Requires kubectl configured with cluster access.
    """
    command = f"kubectl rollout restart deployment {name} -n {namespace}"
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode == 0:
            return {"success": True, "message": result.stdout.strip(), "deployment": name}
        else:
            return {"success": False, "message": result.stderr.strip(), "deployment": name}
    except subprocess.TimeoutExpired:
        return {"success": False, "message": "Command timed out", "deployment": name}
    except Exception as e:
        return {"success": False, "message": str(e), "deployment": name}


def scale_deployment(name: str, replicas: int, namespace: str = "ai-devops") -> dict:
    """Scale a deployment to the specified number of replicas."""
    command = f"kubectl scale deployment {name} --replicas={replicas} -n {namespace}"
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30)
        return {
            "success": result.returncode == 0,
            "message": result.stdout.strip() or result.stderr.strip(),
            "deployment": name,
            "replicas": replicas,
        }
    except Exception as e:
        return {"success": False, "message": str(e)}
