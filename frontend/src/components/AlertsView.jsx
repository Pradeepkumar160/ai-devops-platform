import React, { useState, useEffect } from 'react'
import { fetchAlerts, dismissAlert } from '../services/api'

const COLORS = {
  critical: { card: 'bg-red-950/60 border-red-800',    badge: 'bg-red-700 text-red-100' },
  warning:  { card: 'bg-yellow-950/60 border-yellow-800', badge: 'bg-yellow-700 text-yellow-100' },
  info:     { card: 'bg-blue-950/60 border-blue-800',  badge: 'bg-blue-700 text-blue-100' },
}

const AlertsView = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showResolved, setShowResolved] = useState(false)

  const load = async () => {
    try {
      const { data } = await fetchAlerts()
      setAlerts(data.alerts)
    } catch {
      // Fallback mock
      setAlerts([
        { id: 1, severity: 'critical', title: 'High CPU on Pod-1', message: 'CPU > 90%', timestamp: new Date().toISOString(), resolved: false },
        { id: 2, severity: 'warning',  title: 'Memory Pressure',   message: 'Memory at 75%', timestamp: new Date().toISOString(), resolved: false },
        { id: 3, severity: 'info',     title: 'Deployment OK',     message: 'Rollout complete', timestamp: new Date().toISOString(), resolved: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(); const t = setInterval(load, 20000); return () => clearInterval(t) }, [])

  const handleDismiss = async (id) => {
    try { await dismissAlert(id) } catch {}
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a))
  }

  const handleClearAll = () => setAlerts(prev => prev.map(a => ({ ...a, resolved: true })))

  const visible = alerts.filter(a => showResolved || !a.resolved)

  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse">Loading alerts...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Alerts</h2>
          <p className="text-gray-400 text-sm mt-1">{alerts.filter(a => !a.resolved).length} active alert(s)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowResolved(v => !v)}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 px-4 py-2 rounded-lg transition"
          >
            {showResolved ? 'Hide Resolved' : 'Show Resolved'}
          </button>
          <button
            onClick={handleClearAll}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Clear All
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-gray-900 p-12 rounded-2xl text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-gray-300 font-medium">No active alerts</p>
          <p className="text-gray-500 text-sm mt-1">Your system is healthy!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(alert => {
            const c = COLORS[alert.severity] || COLORS.info
            return (
              <div key={alert.id} className={`${c.card} border rounded-2xl p-5 shadow-lg ${alert.resolved ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`${c.badge} px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide`}>
                        {alert.severity}
                      </span>
                      <h3 className="font-semibold text-white">{alert.title}</h3>
                      {alert.resolved && <span className="text-xs text-gray-400">(resolved)</span>}
                    </div>
                    <p className="text-gray-300 text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                  </div>
                  {!alert.resolved && (
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition shrink-0"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AlertsView
