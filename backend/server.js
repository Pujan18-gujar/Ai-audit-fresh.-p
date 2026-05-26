const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(limiter)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err))

const leadSchema = new mongoose.Schema({
  email: { type: String, required: true },
  company: String,
  role: String,
  teamSize: String,
  useCase: String,
  totalSavings: Number,
  auditData: Object,
  createdAt: { type: Date, default: Date.now }
})

const Lead = mongoose.model('Lead', leadSchema)

app.post('/api/leads', async (req, res) => {
  try {
    const lead = new Lead(req.body)
    await lead.save()
    res.json({ success: true, message: 'Lead saved' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/summary', async (req, res) => {
  const { auditData, totalSavings, useCase } = req.body
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: 'Write a 80-100 word personalized audit summary for a team using AI tools for ' + useCase + ' with potential monthly savings of $' + totalSavings + '. Be specific, actionable, and encouraging. No bullet points.'
        }]
      })
    })
    
    const data = await response.json()
    const summary = data.content?.[0]?.text || getFallbackSummary(totalSavings, useCase)
    res.json({ summary })
  } catch (err) {
    res.json({ summary: getFallbackSummary(totalSavings, useCase) })
  }
})

function getFallbackSummary(savings, useCase) {
  if (savings > 500) return 'Your team has significant optimization opportunities. By switching to more cost-effective plans and right-sizing your AI subscriptions, you could redirect these savings toward growth initiatives. Consider consolidating overlapping tools for maximum efficiency.'
  if (savings > 100) return 'Your AI spending shows room for optimization. Small adjustments to your current plans could free up budget without sacrificing productivity. Focus on matching seat counts to actual active users.'
  return 'Your AI tool spending is well-optimized for your team size and use case. You are making smart choices with your current stack. Consider monitoring usage quarterly to maintain this efficiency.'
}

app.get('/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server running on port ' + PORT))