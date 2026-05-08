import React, { useState, useRef, useEffect } from 'react'
import { chatWithAI } from '../services/api'

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'assistant', text: '👋 Hello! I\'m your AI DevOps Assistant powered by Llama3.\n\nAsk me about:\n• Kubernetes logs & root cause analysis\n• Pod restarts & deployment issues\n• Infrastructure recommendations\n• Alert investigation' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const query = input.trim()
    setInput('')

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: query }])
    setLoading(true)

    try {
      const { data } = await chatWithAI(query)
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'assistant', text: data.response }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'assistant',
        text: '⚠️ Backend not reachable. Make sure the backend container is running:\n\ndocker compose up -d backend'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ height: '70vh' }}>
        {/* Header */}
        <div className="bg-gray-800 px-5 py-3 flex items-center gap-3 border-b border-gray-700">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-semibold text-white">AI DevOps Assistant</p>
            <p className="text-xs text-gray-400">Powered by Llama3 via Ollama</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4 flex gap-3 bg-gray-850">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about your infrastructure..."
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-5 py-3 rounded-xl font-medium transition text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatAssistant
