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
      recommendation = 'You are overpaying by $' + savings.toFixed(0) + '/mo. Expected: $' + expectedSpend + '/mo for ' + seats + ' seats on ' + data.plan + '.'
    } else if (seats > teamSize * 0.5 && planPrice) {
      const betterSeats = Math.ceil(teamSize * 0.7)
      savings = (seats - betterSeats) * planPrice
      recommendation = 'You have ' + seats + ' seats for a team of ' + teamSize + '. Consider reducing to ' + betterSeats + ' seats and save $' + savings.toFixed(0) + '/mo.'
    } else if (ALTERNATIVES[id]) {
      const alt = ALTERNATIVES[id]
      const altTotal = alt.price * seats
      if (spend > altTotal) {
        savings = spend - altTotal
        recommendation = 'Switch to ' + alt.name + ' ($' + alt.price + '/seat) - ' + alt.reason + '. Save $' + savings.toFixed(0) + '/mo.'
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
  const saved = JSON.parse(localStorage.getItem('auditForm') || 'null')

  if (!saved) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>No audit data found.</p>
        <button onClick={() => navigate('/')} style={{ background: '#2563eb', color: 'white', padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Start Audit</button>
      </div>
    </div>
  )

  const { results, totalSavings } = analyzeTools(saved.tools, parseInt(saved.teamSize) || 1)

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Your AI Spend Audit</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Use case: {saved.useCase} - Team size: {saved.teamSize}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#2563eb', color: 'white', borderRadius: '12px', padding: '24px' }}>
            <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Monthly Savings</p>
            <p style={{ fontSize: '36px', fontWeight: 'bold' }}>${totalSavings.toFixed(0)}</p>
          </div>
          <div style={{ background: '#16a34a', color: 'white', borderRadius: '12px', padding: '24px' }}>
            <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Annual Savings</p>
            <p style={{ fontSize: '36px', fontWeight: 'bold' }}>${(totalSavings * 12).toFixed(0)}</p>
          </div>
        </div>

        {totalSavings > 500 && (
          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <p style={{ fontWeight: '600', color: '#9a3412', marginBottom: '8px' }}>Save even more with Credex</p>
            <p style={{ fontSize: '14px', color: '#c2410c' }}>Credex offers discounted AI credits for Cursor, Claude, ChatGPT and more.</p>
            <a href="https://credex.rocks" target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', marginTop: '12px', background: '#ea580c', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none' }}>
              Book Credex Consultation
            </a>
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          {results.map(r => (
            <div key={r.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <p style={{ fontWeight: '600', textTransform: 'capitalize' }}>{r.id}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{r.plan} - {r.seats} seat{r.seats > 1 ? 's' : ''}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Current spend</p>
                  <p style={{ fontWeight: 'bold' }}>${r.spend}/mo</p>
                </div>
              </div>
              <div style={{ background: r.savings > 0 ? '#f0fdf4' : '#f9fafb', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: r.savings > 0 ? '#166534' : '#4b5563' }}>
                {r.recommendation}
              </div>
              {r.savings > 0 && (
                <p style={{ textAlign: 'right', color: '#16a34a', fontWeight: '600', fontSize: '14px', marginTop: '8px' }}>Save ${r.savings.toFixed(0)}/mo</p>
              )}
            </div>
          ))}
        </div>

        {totalSavings < 100 && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
            <p style={{ fontWeight: '600', color: '#1e40af' }}>You are spending well!</p>
            <p style={{ fontSize: '14px', color: '#3b82f6', marginTop: '4px' }}>We will notify you when new optimizations apply to your stack.</p>
          </div>
        )}

        <button onClick={() => navigate('/')}
          style={{ width: '100%', background: 'white', border: '1px solid #d1d5db', color: '#374151', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>
          Edit My Audit
        </button>
      </div>
    </div>
  )
}