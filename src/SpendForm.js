import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TOOLS = [
  { id: 'cursor', name: 'Cursor', plans: ['Hobby', 'Pro', 'Business', 'Enterprise'] },
  { id: 'copilot', name: 'GitHub Copilot', plans: ['Individual', 'Business', 'Enterprise'] },
  { id: 'claude', name: 'Claude', plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API'] },
  { id: 'chatgpt', name: 'ChatGPT', plans: ['Plus', 'Team', 'Enterprise', 'API'] },
  { id: 'gemini', name: 'Gemini', plans: ['Pro', 'Ultra', 'API'] },
  { id: 'openai', name: 'OpenAI API', plans: ['Pay-as-you-go'] },
  { id: 'anthropic', name: 'Anthropic API', plans: ['Pay-as-you-go'] },
  { id: 'windsurf', name: 'Windsurf', plans: ['Free', 'Pro', 'Teams'] },
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

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>AI Spend Audit</h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>Find out where you are overspending on AI tools</p>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Team Info</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '14px', color: '#4b5563', display: 'block', marginBottom: '4px' }}>Team Size</label>
              <input type="number" min="1" value={teamSize}
                onChange={e => { setTeamSize(e.target.value); localStorage.setItem('auditForm', JSON.stringify({ teamSize: e.target.value, useCase, tools })) }}
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '14px' }}
                placeholder="e.g. 5" />
            </div>
            <div>
              <label style={{ fontSize: '14px', color: '#4b5563', display: 'block', marginBottom: '4px' }}>Primary Use Case</label>
              <select value={useCase} onChange={e => { setUseCase(e.target.value); localStorage.setItem('auditForm', JSON.stringify({ teamSize, useCase: e.target.value, tools })) }}
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '14px' }}>
                <option value="">Select...</option>
                {['Coding', 'Writing', 'Data', 'Research', 'Mixed'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>AI Tools You Use</h2>
          {TOOLS.map(tool => (
            <div key={tool.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input type="checkbox" id={tool.id} checked={tools[tool.id].enabled}
                  onChange={e => updateTool(tool.id, 'enabled', e.target.checked)} />
                <label htmlFor={tool.id} style={{ fontWeight: '500', fontSize: '15px' }}>{tool.name}</label>
              </div>
              {tools[tool.id].enabled && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', paddingLeft: '24px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Plan</label>
                    <select value={tools[tool.id].plan} onChange={e => updateTool(tool.id, 'plan', e.target.value)}
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 8px', fontSize: '13px' }}>
                      <option value="">Select</option>
                      {tool.plans.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Seats</label>
                    <input type="number" min="1" value={tools[tool.id].seats}
                      onChange={e => updateTool(tool.id, 'seats', e.target.value)}
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 8px', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Monthly Spend ($)</label>
                    <input type="number" min="0" value={tools[tool.id].monthlySpend}
                      onChange={e => updateTool(tool.id, 'monthlySpend', e.target.value)}
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 8px', fontSize: '13px' }}
                      placeholder="0" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={handleSubmit}
          style={{ width: '100%', background: '#2563eb', color: 'white', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
          Run My Audit
        </button>
      </div>
    </div>
  )
}