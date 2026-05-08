import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import ChatAssistant from './components/ChatAssistant'
import AlertsView from './components/AlertsView'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'alerts',    label: '🚨 Alerts' },
    { id: 'chat',      label: '🤖 AI Assistant' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">⚡ AI DevOps Platform</h1>
            <p className="text-gray-400 text-sm mt-1">Enterprise-Grade Autonomous DevOps & SRE</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-green-400 text-sm font-medium">System Online</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-5 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'alerts'    && <AlertsView />}
        {activeTab === 'chat'      && <ChatAssistant />}
      </main>
    </div>
  )
}

export default App
