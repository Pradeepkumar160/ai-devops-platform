FROM python:3.11-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create reports directory
RUN mkdir -p /app/reports

EXPOSE 8000

# FIXED: use app.main:app since main.py is inside /app/app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
