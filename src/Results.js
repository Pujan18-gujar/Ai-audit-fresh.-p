import { useState, useEffect } from "react";

function AnimatedNumber({ target, prefix = "", suffix = "" }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCurrent(Math.min(Math.round(increment * step), target));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{current.toLocaleString()}{suffix}</span>;
}

const SCORE_COLOR = (score) => {
  if (score >= 75) return "#22C55E";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
};

const SCORE_LABEL = (score) => {
  if (score >= 75) return "Optimized";
  if (score >= 50) return "Average";
  return "Wasteful";
};

export default function Results({ results, onBack }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [activeTab, setActiveTab] = useState("breakdown");

  const totalSavings = results.reduce((sum, r) => sum + (r.savings || 0), 0);
  const totalSpend = results.reduce((sum, r) => sum + (r.currentSpend || 0), 0);
  const annualSavings = totalSavings * 12;
  const efficiencyScore = totalSpend > 0
    ? Math.max(0, Math.round(100 - (totalSavings / totalSpend) * 100))
    : 85;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("https://ai-audit-fresh-p.onrender.com/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auditData: results,
            totalSavings,
            useCase: results[0]?.useCase || "general",
          }),
        });
        const data = await res.json();
        setSummary(data.summary);
      } catch {
        setSummary(
          "Your AI tool spending has been analyzed. Based on your current usage patterns, there are meaningful opportunities to optimize costs without sacrificing productivity. Consider right-sizing plans to match actual team usage."
        );
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLeadSubmit = async () => {
    try {
      await fetch("https://ai-audit-fresh-p.onrender.com/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, totalSavings, auditData: results }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.navDot} />
          AuditAI
        </div>
        <button style={styles.navBack} onClick={onBack}>← New Audit</button>
      </nav>

      <div style={styles.container}>

        {/* Hero savings */}
        <div style={styles.heroCard}>
          <div style={styles.heroLeft}>
            <div style={styles.heroBadge}>✅ Audit Complete</div>
            <h1 style={styles.heroTitle}>You Could Save</h1>
            <div style={styles.heroAmount}>
              $<AnimatedNumber target={totalSavings} /><span style={styles.heroMo}>/mo</span>
            </div>
            <div style={styles.heroAnnual}>
              ≈ $<AnimatedNumber target={annualSavings} /> per year
            </div>
          </div>
          <div style={styles.heroRight}>
            {/* Spend Score */}
            <div style={styles.scoreCard}>
              <div style={styles.scoreLabel}>Spend Efficiency</div>
              <div style={styles.scoreCircle}>
                <svg viewBox="0 0 100 100" style={{ width: "100px", height: "100px" }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1e1e3a" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke={SCORE_COLOR(efficiencyScore)}
                    strokeWidth="8"
                    strokeDasharray={`${(efficiencyScore / 100) * 264} 264`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dasharray 1.5s ease" }}
                  />
                  <text x="50" y="46" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="700">{efficiencyScore}</text>
                  <text x="50" y="62" textAnchor="middle" fill="#666" fontSize="9">/100</text>
                </svg>
              </div>
              <div style={{ ...styles.scoreStatus, color: SCORE_COLOR(efficiencyScore) }}>
                {SCORE_LABEL(efficiencyScore)}
              </div>
            </div>

            {/* Stats */}
            <div style={styles.statGrid}>
              <div style={styles.statBox}>
                <div style={styles.statVal}>${totalSpend.toLocaleString()}</div>
                <div style={styles.statKey}>Current/mo</div>
              </div>
              <div style={styles.statBox}>
                <div style={{ ...styles.statVal, color: "#22C55E" }}>${totalSavings.toLocaleString()}</div>
                <div style={styles.statKey}>Savings/mo</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div style={styles.summaryCard}>
          <div style={styles.summaryHeader}>
            <span style={styles.summaryIcon}>🧠</span>
            <span style={styles.summaryTitle}>AI Insight</span>
          </div>
          {loadingSummary ? (
            <div style={styles.summaryLoading}>
              <div style={styles.pulse}>Generating personalized insight...</div>
            </div>
          ) : (
            <p style={styles.summaryText}>{summary}</p>
          )}
        </div>

        {/* Tabs */}
        <div style={styles.tabRow}>
          {["breakdown", "leads"].map((tab) => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                borderBottom: activeTab === tab ? "2px solid #7C3AED" : "2px solid transparent",
                color: activeTab === tab ? "#A78BFA" : "#52525B",
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "breakdown" ? "📊 Tool Breakdown" : "📬 Get Full Report"}
            </button>
          ))}
        </div>

        {/* Tool Breakdown */}
        {activeTab === "breakdown" && (
          <div style={styles.breakdownList}>
            {results.map((r, i) => (
              <div key={i} style={styles.toolCard}>
                <div style={styles.toolCardTop}>
                  <div>
                    <div style={styles.toolCardName}>{r.tool}</div>
                    <div style={styles.toolCardPlan}>{r.plan} · {r.seats} seat{r.seats > 1 ? "s" : ""}</div>
                  </div>
                  <div style={styles.toolCardRight}>
                    <div style={styles.toolCardSpend}>${r.currentSpend}/mo</div>
                    {r.savings > 0 && (
                      <div style={styles.savingsBadge}>Save ${r.savings}/mo</div>
                    )}
                    {r.savings === 0 && (
                      <div style={styles.optimalBadge}>✓ Optimal</div>
                    )}
                  </div>
                </div>
                <div style={styles.toolCardRec}>{r.recommendation}</div>
                {r.savings > 0 && (
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${Math.min((r.savings / r.currentSpend) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lead Capture */}
        {activeTab === "leads" && (
          <div style={styles.leadCard}>
            {submitted ? (
              <div style={styles.leadSuccess}>
                <div style={styles.leadSuccessIcon}>🎉</div>
                <h3 style={{ margin: "0 0 8px", fontSize: "20px" }}>Report Sent!</h3>
                <p style={{ color: "#A1A1AA", margin: 0 }}>
                  Check your email for the full breakdown + recommendations.
                </p>
              </div>
            ) : (
              <>
                <h3 style={styles.leadTitle}>Get Your Full Audit Report</h3>
                <p style={styles.leadSub}>
                  We'll send a detailed PDF with exact steps to save ${totalSavings}/mo
                </p>
                <div style={styles.leadFields}>
                  <input
                    style={styles.leadInput}
                    placeholder="Work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                  <input
                    style={styles.leadInput}
                    placeholder="Company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <button
                  style={{
                    ...styles.btnPrimary,
                    opacity: !email ? 0.4 : 1,
                    width: "100%",
                  }}
                  onClick={() => email && handleLeadSubmit()}
                >
                  📬 Send My Report
                </button>
                {totalSavings > 500 && (
                  <div style={styles.credexBanner}>
                    💳 <strong>Pro tip:</strong> Use Credex to manage all AI subscriptions in one place and enforce spend limits automatically.
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#0A0A0F",
    color: "#FAFAFA",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed", top: "-200px", left: "-200px", width: "600px", height: "600px",
    borderRadius: "50%", background: "radial-gradient(circle, #7C3AED22 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  blob2: {
    position: "fixed", bottom: "-200px", right: "-200px", width: "600px", height: "600px",
    borderRadius: "50%", background: "radial-gradient(circle, #22C55E22 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 40px", borderBottom: "1px solid #1a1a2e",
    backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100,
    background: "#0A0A0F99",
  },
  navLogo: {
    display: "flex", alignItems: "center", gap: "8px", fontSize: "18px",
    fontWeight: "700", letterSpacing: "-0.5px", color: "#fff",
  },
  navDot: {
    width: "8px", height: "8px", borderRadius: "50%",
    background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "inline-block",
  },
  navBack: {
    background: "transparent", border: "1px solid #2a2a4e", borderRadius: "8px",
    padding: "8px 16px", color: "#A1A1AA", fontSize: "13px", cursor: "pointer",
  },
  container: { maxWidth: "800px", margin: "0 auto", padding: "40px 20px 80px", position: "relative", zIndex: 1 },
  heroCard: {
    background: "linear-gradient(135deg, #111122, #0D0D1F)",
    border: "1px solid #1e1e3a", borderRadius: "24px", padding: "40px",
    marginBottom: "24px", display: "flex", gap: "40px", flexWrap: "wrap",
    boxShadow: "0 20px 60px #00000080",
  },
  heroLeft: { flex: "1", minWidth: "200px" },
  heroRight: { display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-end" },
  heroBadge: {
    display: "inline-block", fontSize: "12px", background: "#22C55E22", color: "#86EFAC",
    border: "1px solid #22C55E44", padding: "5px 14px", borderRadius: "20px", marginBottom: "16px",
  },
  heroTitle: { fontSize: "16px", color: "#71717A", fontWeight: "500", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "1px" },
  heroAmount: {
    fontSize: "clamp(48px, 8vw, 72px)", fontWeight: "800", letterSpacing: "-3px",
    color: "#fff", lineHeight: "1", marginBottom: "8px",
    textShadow: "0 0 40px #7C3AED40",
  },
  heroMo: { fontSize: "24px", color: "#52525B", fontWeight: "400" },
  heroAnnual: { fontSize: "16px", color: "#A1A1AA", marginTop: "8px" },
  scoreCard: { textAlign: "center" },
  scoreLabel: { fontSize: "11px", color: "#52525B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
  scoreCircle: { margin: "0 auto" },
  scoreStatus: { fontSize: "12px", fontWeight: "600", marginTop: "4px" },
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  statBox: {
    background: "#0D0D1A", border: "1px solid #1e1e3a", borderRadius: "12px",
    padding: "14px 16px", textAlign: "center",
  },
  statVal: { fontSize: "20px", fontWeight: "700", letterSpacing: "-0.5px" },
  statKey: { fontSize: "11px", color: "#52525B", marginTop: "4px" },
  summaryCard: {
    background: "#0D0D1A", border: "1px solid #7C3AED33", borderRadius: "16px",
    padding: "24px", marginBottom: "24px",
  },
  summaryHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" },
  summaryIcon: { fontSize: "20px" },
  summaryTitle: { fontSize: "14px", fontWeight: "600", color: "#A78BFA" },
  summaryLoading: { color: "#52525B", fontSize: "14px", fontStyle: "italic" },
  pulse: { animation: "pulse 1.5s infinite" },
  summaryText: { color: "#D4D4D8", fontSize: "15px", lineHeight: "1.7", margin: 0 },
  tabRow: { display: "flex", borderBottom: "1px solid #1e1e3a", marginBottom: "24px", gap: "4px" },
  tab: {
    background: "transparent", border: "none", borderBottom: "2px solid transparent",
    padding: "12px 20px", cursor: "pointer", fontSize: "14px", fontWeight: "500",
    transition: "all 0.2s",
  },
  breakdownList: { display: "flex", flexDirection: "column", gap: "14px" },
  toolCard: {
    background: "#111122", border: "1px solid #1e1e3a", borderRadius: "16px",
    padding: "22px", transition: "border-color 0.2s",
  },
  toolCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  toolCardName: { fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "4px" },
  toolCardPlan: { fontSize: "13px", color: "#52525B" },
  toolCardRight: { textAlign: "right" },
  toolCardSpend: { fontSize: "16px", fontWeight: "600", color: "#fff" },
  savingsBadge: {
    display: "inline-block", background: "#22C55E22", color: "#86EFAC",
    border: "1px solid #22C55E44", borderRadius: "6px", padding: "3px 10px",
    fontSize: "12px", fontWeight: "600", marginTop: "6px",
  },
  optimalBadge: {
    display: "inline-block", background: "#06B6D422", color: "#67E8F9",
    border: "1px solid #06B6D444", borderRadius: "6px", padding: "3px 10px",
    fontSize: "12px", fontWeight: "600", marginTop: "6px",
  },
  toolCardRec: { fontSize: "14px", color: "#A1A1AA", lineHeight: "1.5" },
  progressBar: { height: "4px", background: "#1e1e3a", borderRadius: "2px", marginTop: "14px" },
  progressFill: {
    height: "100%", background: "linear-gradient(90deg, #7C3AED, #22C55E)",
    borderRadius: "2px", transition: "width 1s ease",
  },
  leadCard: {
    background: "#111122", border: "1px solid #1e1e3a", borderRadius: "20px",
    padding: "32px", boxShadow: "0 20px 60px #00000060",
  },
  leadTitle: { fontSize: "20px", fontWeight: "700", margin: "0 0 8px" },
  leadSub: { color: "#A1A1AA", fontSize: "14px", margin: "0 0 24px" },
  leadFields: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" },
  leadInput: {
    background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: "10px",
    padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #7C3AED, #2563EB)", border: "none",
    borderRadius: "10px", padding: "14px 28px", color: "#fff", fontSize: "15px",
    fontWeight: "600", cursor: "pointer", transition: "all 0.2s", letterSpacing: "-0.3px",
  },
  credexBanner: {
    marginTop: "16px", background: "#7C3AED15", border: "1px solid #7C3AED33",
    borderRadius: "10px", padding: "14px 16px", fontSize: "13px", color: "#C4B5FD",
    lineHeight: "1.5",
  },
  leadSuccess: { textAlign: "center", padding: "40px 0" },
  leadSuccessIcon: { fontSize: "48px", marginBottom: "16px" },
};