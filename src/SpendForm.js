import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TOOLS = [
  { id: 'cursor', name: 'Cursor', icon: '⚡', plans: ['Hobby', 'Pro', 'Business', 'Enterprise'] },
  { id: 'copilot', name: 'GitHub Copilot', icon: '🤖', plans: ['Individual', 'Business', 'Enterprise'] },
  { id: 'claude', name: 'Claude', icon: '🧠', plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API'] },
  { id: 'chatgpt', name: 'ChatGPT', icon: '💬', plans: ['Plus', 'Team', 'Enterprise', 'API'] },
  { id: 'gemini', name: 'Gemini', icon: '✨', plans: ['Pro', 'Ultra', 'API'] },
  { id: 'openai', name: 'OpenAI API', icon: '🔮', plans: ['Pay-as-you-go'] },
  { id: 'anthropic', name: 'Anthropic API', icon: '🔬', plans: ['Pay-as-you-go'] },
  { id: 'windsurf', name: 'Windsurf', icon: '🏄', plans: ['Free', 'Pro', 'Teams'] },
]

const defaultTool = { enabled: false, plan: '', seats: 1, monthlySpend: '' }

export default function SpendForm() {
  const navigate = useNavigate()
  const saved = JSON.parse(localStorage.getItem('auditForm') || 'null')
  const [teamSize, setTeamSize] = useState(saved?.teamSize || '')
  const [useCase, setUseCase] = useState(saved?.useCase || '')
  const [tools, setTools] = useState(saved?.tools || Object.fromEntries(TOOLS.map(t => [t.id, { ...defaultTool }])))

  const updateTool = (id, field, value) => {
    const updated = { ...tools, [id]: { ...tools[id], [field]: value } }
    setTools(updated)
    localStorage.setItem('auditForm', JSON.stringify({ teamSize, useCase, tools: updated }))
  }

  const handleSubmit = () => {
    localStorage.setItem('auditForm', JSON.stringify({ teamSize, useCase, tools }))
    navigate('/results')
  }

  const activeTools = Object.values(tools).filter(t => t.enabled).length

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 16px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.15)', borderRadius: '50px', padding: '8px 20px', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>💰</span>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>Free AI Cost Analyzer</span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'white', marginBottom: '12px', lineHeight: 1.2 }}>
            AI Spend Audit
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>
            Find out where you are overspending on AI tools
          </p>
        </div>

        {/* Team Info Card */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', marginBottom: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👥</span> Team Info
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Team Size</label>
              <input type="number" min="1" value={teamSize}
                onChange={e => { setTeamSize(e.target.value); localStorage.setItem('auditForm', JSON.stringify({ teamSize: e.target.value, useCase, tools })) }}
                style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '15px', outline: 'none', transition: 'border 0.2s' }}
                placeholder="e.g. 5" />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Primary Use Case</label>
              <select value={useCase} onChange={e => { setUseCase(e.target.value); localStorage.setItem('auditForm', JSON.stringify({ teamSize, useCase: e.target.value, tools })) }}
                style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '15px', outline: 'none', background: 'white' }}>
                <option value="">Select...</option>
                {['Coding', 'Writing', 'Data', 'Research', 'Mixed'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tools Card */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', marginBottom: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🛠️</span> AI Tools You Use
            </h2>
            {activeTools > 0 && (
              <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                {activeTools} selected
              </span>
            )}
          </div>

          {TOOLS.map((tool, i) => (
            <div key={tool.id} style={{ marginBottom: i === TOOLS.length - 1 ? 0 : '16px', paddingBottom: i === TOOLS.length - 1 ? 0 : '16px', borderBottom: i === TOOLS.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: tools[tool.id].enabled ? '14px' : 0, cursor: 'pointer' }}
                onClick={() => updateTool(tool.id, 'enabled', !tools[tool.id].enabled)}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: tools[tool.id].enabled ? '2px solid #7c3aed' : '2px solid #d1d5db', background: tools[tool.id].enabled ? '#7c3aed' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {tools[tool.id].enabled && <span style={{ color: 'white', fontSize: '13px' }}>✓</span>}
                </div>
                <span style={{ fontSize: '20px' }}>{tool.icon}</span>
                <span style={{ fontWeight: '600', fontSize: '15px' }}>{tool.name}</span>
              </div>

              {tools[tool.id].enabled && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', paddingLeft: '34px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Plan</label>
                    <select value={tools[tool.id].plan} onChange={e => updateTool(tool.id, 'plan', e.target.value)}
                      style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '8px', padding: '7px 8px', fontSize: '13px', background: 'white' }}>
                      <option value="">Select</option>
                      {tool.plans.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Seats</label>
                    <input type="number" min="1" value={tools[tool.id].seats}
                      onChange={e => updateTool(tool.id, 'seats', e.target.value)}
                      style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '8px', padding: '7px 8px', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>$/Month</label>
                    <input type="number" min="0" value={tools[tool.id].monthlySpend}
                      onChange={e => updateTool(tool.id, 'monthlySpend', e.target.value)}
                      style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '8px', padding: '7px 8px', fontSize: '13px' }}
                      placeholder="0" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={handleSubmit}
          style={{ width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '16px', borderRadius: '14px', fontSize: '17px', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(102,126,234,0.4)' }}>
          Run My Audit →
        </button>
      </div>
    </div>
  )
}