import axios from 'axios'

// Backend is on port 8100 (mapped from container 8000)
// In production (docker-compose), nginx proxies /api → backend container
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8100/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
})

export const fetchMetrics = () => api.get('/metrics')
export const fetchMetricsHistory = () => api.get('/metrics/history')
export const fetchAlerts = () => api.get('/alerts')
export const dismissAlert = (id) => api.delete(`/alerts/${id}`)
export const chatWithAI = (query) => api.post('/chat', { query })
export const analyzeLogs = (logs) => api.post('/analyze_logs', { logs })
export const triggerAIAnalysis = (data) => api.post('/alerts/trigger_ai_analysis', data)

export default api
