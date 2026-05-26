import { useState } from 'react';
import SpendForm from './SpendForm';
import Results from './Results';

// Audit logic — savings calculation per tool
function runAudit(formData) {
  const { tools, teamSize, useCase } = formData;
  const size = parseInt(teamSize) || 1;

  return tools.map((tool) => {
    const spend = tool.monthlySpend || 0;
    const seats = tool.seats || 1;
    let savings = 0;
    let recommendation = 'Spend looks optimal for your usage.';

    const id = tool.id?.toLowerCase() || tool.name?.toLowerCase();

    if (id?.includes('cursor')) {
      if (seats > size * 0.7 && spend > 20) {
        savings = Math.round((seats - Math.ceil(size * 0.6)) * 20);
        recommendation = `You have ${seats} seats but only ~${Math.ceil(size * 0.6)} active users. Remove ${seats - Math.ceil(size * 0.6)} unused seats.`;
      } else if (spend > 40 * seats) {
        savings = Math.round(spend - 20 * seats);
        recommendation = 'Consider downgrading from Business to Pro plan — saves $20/seat/mo.';
      }
    } else if (id?.includes('copilot')) {
      if (seats > size && spend > 10) {
        savings = Math.round((seats - size) * 10);
        recommendation = `Remove ${seats - size} excess Copilot seats. Match seat count to team size.`;
      } else if (spend > 19 * seats) {
        savings = Math.round((spend - 10 * seats));
        recommendation = 'Downgrade from Business to Individual plan if enterprise features are not needed.';
      }
    } else if (id?.includes('claude')) {
      if (seats > 1 && spend < 25 * seats) {
        savings = 0;
        recommendation = 'Claude Team plan pricing is already competitive for your team size.';
      } else if (spend > 25 * seats) {
        savings = Math.round(spend - 20 * seats);
        recommendation = 'Switch from Team to individual Pro plans if team collaboration features are unused.';
      }
    } else if (id?.includes('chatgpt')) {
      if (seats > size * 0.8 && spend > 20) {
        savings = Math.round((seats - Math.ceil(size * 0.7)) * 20);
        recommendation = `Reduce ChatGPT seats to ${Math.ceil(size * 0.7)} active users and save $${savings}/mo.`;
      }
    } else if (id?.includes('gemini')) {
      if (spend > 20 * seats) {
        savings = Math.round(spend - 20 * seats);
        recommendation = 'Gemini Advanced pricing may be better than Business for smaller teams.';
      }
    } else if (id?.includes('windsurf')) {
      if (seats > size * 0.8 && spend > 15) {
        savings = Math.round((seats - Math.ceil(size * 0.7)) * 15);
        recommendation = `Reduce Windsurf to ${Math.ceil(size * 0.7)} seats — remove inactive users.`;
      }
    }

    return {
      tool: tool.name,
      plan: tool.plan,
      seats,
      currentSpend: spend,
      savings: Math.max(0, savings),
      recommendation,
      useCase,
    };
  });
}

export default function App() {
  const [results, setResults] = useState(null);

  const handleAudit = (formData) => {
    const auditResults = runAudit(formData);
    setResults(auditResults);
  };

  return results ? (
    <Results results={results} onBack={() => setResults(null)} />
  ) : (
    <SpendForm onSubmit={handleAudit} />
  );
}