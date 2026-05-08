import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchMetrics, fetchMetricsHistory } from '../services/api'

function MetricCard({ title, value, unit = '', color = 'blue', icon = '📈' }) {
  const colors = {
    blue:   'border-blue-500 bg-blue-900/20',
    red:    'border-red-500 bg-red-900/20',
    green:  'border-green-500 bg-green-900/20',
    yellow: 'border-yellow-500 bg-yellow-900/20',
  }
  return (
    <div className={`border ${colors[color]} rounded-2xl p-5 shadow-lg`}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}<span className="text-lg text-gray-400 ml-1">{unit}</span></p>
    </div>
  )
}

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [backendDown, setBackendDown] = useState(false)

  const load = async () => {
    try {
      const [m, h] = await Promise.all([fetchMetrics(), fetchMetricsHistory()])
      setMetrics(m.data)
      setHistory(h.data.data)
      setBackendDown(false)
    } catch {
      // Only set backendDown=true when backend is truly unreachable
      setBackendDown(true)
      setMetrics({ cpu_usage: 45, memory_usage: 58, pod_health: { healthy: 10, total: 12 }, restart_count: 2, network_in_gbps: 2.5, network_out_gbps: 1.8, source: 'mock' })
      setHistory([
        { time: '00:00', cpu: 30, memory: 45, pods: 8 },
        { time: '04:00', cpu: 35, memory: 48, pods: 9 },
        { time: '08:00', cpu: 42, memory: 52, pods: 10 },
        { time: '12:00', cpu: 55, memory: 60, pods: 12 },
        { time: '16:00', cpu: 48, memory: 58, pods: 11 },
        { time: '20:00', cpu: 40, memory: 50, pods: 10 },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 15000) // refresh every 15s
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse">Loading metrics...</div>

  return (
    <div className="space-y-8">
      {/* Source badge */}
      {backendDown ? (
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 text-sm px-4 py-2 rounded-lg">
          ⚠️ Cannot reach backend — showing mock data. Run: <code>docker compose up -d</code>
        </div>
      ) : metrics?.source === 'prometheus' ? (
        <div className="bg-green-900/30 border border-green-700 text-green-300 text-sm px-4 py-2 rounded-lg">
          ✅ Live data from Prometheus
        </div>
      ) : (
        <div className="bg-blue-900/30 border border-blue-700 text-blue-300 text-sm px-4 py-2 rounded-lg">
          🔄 Backend connected — metrics are live (Prometheus node exporter not required in Docker mode)
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="CPU Usage"    value={metrics.cpu_usage}    unit="%" color="blue"   icon="🖥️" />
        <MetricCard title="Memory Usage" value={metrics.memory_usage}  unit="%" color="red"    icon="💾" />
        <MetricCard title="Pod Health"   value={`${metrics.pod_health.healthy}/${metrics.pod_health.total}`} color="green"  icon="🟢" />
        <MetricCard title="Restarts"     value={metrics.restart_count} color="yellow" icon="🔄" />
      </div>

      {/* Line Chart */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-bold mb-4">Infrastructure Metrics Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="cpu"    stroke="#3b82f6" strokeWidth={2} dot={false} name="CPU %" />
            <Line type="monotone" dataKey="memory" stroke="#ef4444" strokeWidth={2} dot={false} name="Memory %" />
            <Line type="monotone" dataKey="pods"   stroke="#10b981" strokeWidth={2} dot={false} name="Pods" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Network */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-bold mb-4">Network Traffic</h2>
        <div className="space-y-4">
          {[
            { label: 'Incoming', value: metrics.network_in_gbps, color: 'green', pct: Math.min(metrics.network_in_gbps / 5 * 100, 100) },
            { label: 'Outgoing', value: metrics.network_out_gbps, color: 'blue',  pct: Math.min(metrics.network_out_gbps / 5 * 100, 100) },
          ].map(({ label, value, color, pct }) => (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">{label} Traffic</span>
                <span className={`text-${color}-400 font-medium`}>{value} GB/s</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className={`bg-${color}-500 h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
