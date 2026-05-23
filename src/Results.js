import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PRICING = {
  cursor: { Hobby: 0, Pro: 20, Business: 40, Enterprise: 60 },
  copilot: { Individual: 10, Business: 19, Enterprise: 39 },
  claude: { Free: 0, Pro: 20, Max: 100, Team: 30, Enterprise: 60, API: null },
  chatgpt: { Plus: 20, Team: 30, Enterprise: 60, API: null },
  gemini: { Pro: 20, Ultra: 300, API: null },
  openai: { 'Pay-as-you-go': null },
  anthropic: { 'Pay-as-you-go': null },
  windsurf: { Free: 0, Pro: 15, Teams: 35 },
}

const ALTERNATIVES = {
  cursor: { name: 'Windsurf Pro', price: 15, reason: 'Similar AI coding features at lower cost' },
  copilot: { name: 'Cursor Pro', price: 20, reason: 'More capable AI with better context window' },
  chatgpt: { name: 'Claude Pro', price: 20, reason: 'Better for writing and research tasks' },
  gemini: { name: 'Claude Pro', price: 20, reason: 'More reliable outputs for most use cases' },
}

function analyzeTools(tools, teamSize) {
  const results = []
  let totalSavings = 0
  Object.entries(tools).forEach(([id, data]) => {
    if (!data.enabled) return
    const spend = parseFloat(data.monthlySpend) || 0
    const seats = parseInt(data.seats) || 1
    const planPrice = PRICING[id]?.[data.plan]
    const expectedSpend = planPrice ? planPrice * seats : spend
    let recommendation = ''
    let savings = 0
    if (planPrice && spend > expectedSpend * 1.1) {
      savings = spend - expectedSpend
      recommendation = 'Overpaying by $' + savings.toFixed(0) + '/mo. Expected $' + expectedSpend + '/mo for ' + seats + ' seats on ' + data.plan + '.'
    } else if (seats > teamSize * 0.5 && planPrice) {
      const betterSeats = Math.ceil(teamSize * 0.7)
      savings = (seats - betterSeats) * planPrice
      recommendation = 'Reduce from ' + seats + ' to ' + betterSeats + ' seats. Save $' + savings.toFixed(0) + '/mo.'
    } else if (ALTERNATIVES[id]) {
      const alt = ALTERNATIVES[id]
      const altTotal = alt.price * seats
      if (spend > altTotal) {
        savings = spend - altTotal
        recommendation = 'Switch to ' + alt.name + ' - ' + alt.reason + '. Save $' + savings.toFixed(0) + '/mo.'
      }
    }
    if (!recommendation) recommendation = 'Spend looks optimal for your usage.'
    totalSavings += savings
    results.push({ id, plan: data.plan, spend, seats, recommendation, savings })
  })
  return { results, totalSavings }
}

export default function Results() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const saved = JSON.parse(localStorage.getItem('auditForm') || 'null')

  if (!saved) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '18px' }}>No audit data found.</p>
        <button onClick={() => navigate('/')} style={{ background: '#7c3aed', color: 'white', padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>Start Audit</button>
      </div>
    </div>
  )

  const { results, totalSavings } = analyzeTools(saved.tools, parseInt(saved.teamSize) || 1)

  const handleEmailSubmit = () => {
    if (email) {
      localStorage.setItem('auditEmail', email)
      setSubmitted(true)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 16px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Your AI Spend Audit</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Use case: {saved.useCase} - Team size: {saved.teamSize}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>Monthly Savings</p>
            <p style={{ fontSize: '48px', fontWeight: '800', color: '#7c3aed' }}>${totalSavings.toFixed(0)}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>Annual Savings</p>
            <p style={{ fontSize: '48px', fontWeight: '800', color: '#16a34a' }}>${(totalSavings * 12).toFixed(0)}</p>
          </div>
        </div>

        {totalSavings > 500 && (
          <div style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <p style={{ fontWeight: '700', color: 'white', fontSize: '18px', marginBottom: '8px' }}>Save even more with Credex</p>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginBottom: '16px' }}>Credex offers discounted AI credits for Cursor, Claude, ChatGPT and more. Real savings, not estimates.</p>
            <a href="https://credex.rocks" target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', background: 'white', color: '#ea580c', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
              Book Free Consultation
            </a>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          {results.map(r => (
            <div key={r.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '16px', textTransform: 'capitalize' }}>{r.id}</p>
                  <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>{r.plan} - {r.seats} seat{r.seats > 1 ? 's' : ''}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>Current</p>
                  <p style={{ fontWeight: '700', fontSize: '16px' }}>${r.spend}/mo</p>
                </div>
              </div>
              <div style={{ background: r.savings > 0 ? '#f0fdf4' : '#f8fafc', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: r.savings > 0 ? '#166534' : '#6b7280', borderLeft: r.savings > 0 ? '3px solid #16a34a' : '3px solid #e5e7eb' }}>
                {r.recommendation}
              </div>
              {r.savings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                    Save ${r.savings.toFixed(0)}/mo
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {totalSavings < 100 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>You are spending well!</p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>We will notify you when new optimizations apply to your stack.</p>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', marginBottom: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <h3 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>Get your full report</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>We will send you the complete audit with personalized recommendations.</p>
          {!submitted ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ flex: 1, border: '2px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '15px', outline: 'none' }} />
              <button onClick={handleEmailSubmit}
                style={{ background: '#7c3aed', color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}>
                Send Report
              </button>
            </div>
          ) : (
            <p style={{ color: '#16a34a', fontWeight: '600' }}>Report sent! Check your inbox.</p>
          )}
        </div>

        <button onClick={() => navigate('/')}
          style={{ width: '100%', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '14px', borderRadius: '14px', fontSize: '16px', fontWeight: '600', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
          Edit My Audit
        </button>
      </div>
    </div>
  )
}