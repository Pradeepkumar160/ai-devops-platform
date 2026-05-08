# =============================================================================
# AI-POWERED AUTONOMOUS DEVOPS & SRE PLATFORM
# COMPLETE POWERSHELL SETUP GUIDE
# =============================================================================
# Port assignments (all conflicts avoided):
#   Frontend  → http://localhost:4300
#   Backend   → http://localhost:8100
#   Prometheus→ http://localhost:9095
#   Grafana   → http://localhost:3100   admin / devops123
# =============================================================================

# ─────────────────────────────────────────────────────────────────────────────
# STEP 0: PREREQUISITES  (run once on a fresh machine)
# ─────────────────────────────────────────────────────────────────────────────

# Install Chocolatey (run PowerShell as Administrator)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install required tools
choco install docker-desktop minikube kubernetes-cli kubernetes-helm git nodejs -y

# Verify installations
docker --version
minikube version
kubectl version --client
helm version
node --version

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1: CLONE / SET UP PROJECT FOLDER
# ─────────────────────────────────────────────────────────────────────────────

# If you have git repo:
git clone https://github.com/YOUR_USERNAME/ai-devops-platform.git
Set-Location ai-devops-platform

# OR: If building from the files provided, just cd into your project folder:
# Set-Location "C:\path\to\ai-devops-platform"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 2: QUICK START WITH DOCKER COMPOSE (RECOMMENDED FIRST)
# This gets everything running without Kubernetes — great for development
# ─────────────────────────────────────────────────────────────────────────────

# Start all services
docker compose up -d --build

# Check everything is running
docker compose ps

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Access the platform:
Start-Process "http://localhost:4300"    # React Dashboard
Start-Process "http://localhost:8100"    # FastAPI (API docs at /docs)
Start-Process "http://localhost:9095"    # Prometheus
Start-Process "http://localhost:3100"    # Grafana (admin / devops123)

# Stop everything
# docker compose down

# ─────────────────────────────────────────────────────────────────────────────
# STEP 3: INSTALL OLLAMA (AI Engine — runs locally, NOT in Docker)
# ─────────────────────────────────────────────────────────────────────────────

# Download and install Ollama from https://ollama.com/download
# Then in a NEW PowerShell window, run:
ollama serve

# In another PowerShell window, pull the Llama3 model (~4 GB):
ollama pull llama3

# Test it works:
ollama run llama3 "Say hello"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 4: KUBERNETES SETUP WITH MINIKUBE (optional - for full K8s experience)
# ─────────────────────────────────────────────────────────────────────────────

# Start Minikube cluster
minikube start --driver=docker --memory=4096 --cpus=2

# Verify cluster is running
kubectl get nodes
kubectl cluster-info

# Point Docker to use Minikube's registry (so images are available in cluster)
# Run this in your PowerShell session before building:
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Build images (they go directly into minikube's Docker)
docker build -t ai-devops-backend:latest ./backend
docker build -t ai-devops-frontend:latest ./frontend

# Deploy to Kubernetes
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml

# Check deployments
kubectl get all -n ai-devops

# Access via Minikube (opens browser)
minikube service backend-service -n ai-devops
minikube service frontend-service -n ai-devops

# ─────────────────────────────────────────────────────────────────────────────
# STEP 5: INSTALL PROMETHEUS + GRAFANA VIA HELM (inside Kubernetes)
# ─────────────────────────────────────────────────────────────────────────────

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install kube-prometheus-stack (includes Prometheus + Grafana + Alert Manager)
helm install monitoring prometheus-community/kube-prometheus-stack `
  --namespace monitoring `
  --create-namespace `
  --set grafana.adminPassword=devops123

# Wait for pods to be ready
kubectl get pods -n monitoring -w

# Port-forward Grafana to local port 3100
kubectl port-forward svc/monitoring-grafana 3100:80 -n monitoring
# Open: http://localhost:3100  (admin / devops123)

# Port-forward Prometheus to local port 9095
kubectl port-forward svc/monitoring-kube-prometheus-prometheus 9095:9090 -n monitoring
# Open: http://localhost:9095

# ─────────────────────────────────────────────────────────────────────────────
# STEP 6: FRONTEND DEVELOPMENT (run without Docker)
# ─────────────────────────────────────────────────────────────────────────────

Set-Location frontend
npm install
npm run dev
# Opens at http://localhost:5173
# (API calls proxy to http://localhost:8100 via vite.config.js)

# ─────────────────────────────────────────────────────────────────────────────
# STEP 7: BACKEND DEVELOPMENT (run without Docker)
# ─────────────────────────────────────────────────────────────────────────────

Set-Location backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run FastAPI dev server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8100

# API docs available at: http://localhost:8100/docs

# ─────────────────────────────────────────────────────────────────────────────
# STEP 8: GRAFANA DASHBOARD SETUP
# ─────────────────────────────────────────────────────────────────────────────
# After opening Grafana at http://localhost:3100:
# 1. Login: admin / devops123
# 2. Go to: Connections → Data Sources → Add data source → Prometheus
#    URL: http://localhost:9095
# 3. Go to: Dashboards → Import → Enter ID: 6417 (Kubernetes cluster overview)
# 4. Or import ID: 315 (Kubernetes cluster monitoring)
# 5. Create custom panels for:
#    - CPU: rate(container_cpu_usage_seconds_total[5m])
#    - Memory: container_memory_usage_bytes
#    - Pod restarts: kube_pod_container_status_restarts_total

# ─────────────────────────────────────────────────────────────────────────────
# USEFUL POWERSHELL COMMANDS
# ─────────────────────────────────────────────────────────────────────────────

# Check all running Docker containers
docker ps

# View backend logs in real-time
docker compose logs -f backend

# Rebuild just the backend after code changes
docker compose up -d --build backend

# Test the API
Invoke-RestMethod -Uri "http://localhost:8100/" -Method Get
Invoke-RestMethod -Uri "http://localhost:8100/api/metrics" -Method Get
Invoke-RestMethod -Uri "http://localhost:8100/api/alerts" -Method Get

# Test AI chat
$body = '{"query": "What is causing high CPU usage?"}'
Invoke-RestMethod -Uri "http://localhost:8100/api/chat" -Method Post `
  -ContentType "application/json" -Body $body

# Test log analysis
$body = '{"logs": "Error: OOMKilled - container exceeded memory limit"}'
Invoke-RestMethod -Uri "http://localhost:8100/api/analyze_logs" -Method Post `
  -ContentType "application/json" -Body $body

# Restart a Kubernetes deployment
kubectl rollout restart deployment backend -n ai-devops
kubectl rollout restart deployment frontend -n ai-devops

# Watch pod status
kubectl get pods -n ai-devops -w

# Scale a deployment
kubectl scale deployment backend --replicas=3 -n ai-devops

# Stop Minikube (saves resources)
minikube stop

# ─────────────────────────────────────────────────────────────────────────────
# ENVIRONMENT VARIABLES (.env file — create in project root)
# ─────────────────────────────────────────────────────────────────────────────
# SLACK_TOKEN=xoxb-your-slack-token-here
# SLACK_CHANNEL=#alerts
# OLLAMA_HOST=http://host.docker.internal:11434
# OLLAMA_MODEL=llama3
