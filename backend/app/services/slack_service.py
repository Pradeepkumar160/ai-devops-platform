import os

SLACK_TOKEN = os.getenv("SLACK_TOKEN", "")
SLACK_CHANNEL = os.getenv("SLACK_CHANNEL", "#alerts")


def send_alert(message: str) -> dict:
    """Send an alert to Slack. Silently skips if token not configured."""
    if not SLACK_TOKEN:
        print(f"[Slack] Token not set. Would have sent: {message}")
        return {"success": False, "reason": "SLACK_TOKEN not configured"}
    try:
        from slack_sdk import WebClient
        client = WebClient(token=SLACK_TOKEN)
        response = client.chat_postMessage(channel=SLACK_CHANNEL, text=message)
        return {"success": True, "ts": response["ts"]}
    except Exception as e:
        return {"success": False, "error": str(e)}
