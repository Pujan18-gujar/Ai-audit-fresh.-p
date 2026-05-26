import { useState } from "react";

const TOOLS = [
  { id: "cursor", name: "Cursor", icon: "⚡", color: "#7C3AED" },
  { id: "copilot", name: "GitHub Copilot", icon: "🐙", color: "#238636" },
  { id: "claude", name: "Claude", icon: "🧠", color: "#D97706" },
  { id: "chatgpt", name: "ChatGPT", icon: "✨", color: "#10A37F" },
  { id: "gemini", name: "Gemini", icon: "💎", color: "#4285F4" },
  { id: "windsurf", name: "Windsurf", icon: "🌊", color: "#06B6D4" },
];

const PLANS = {
  cursor: ["Free", "Pro ($20/mo)", "Business ($40/mo)"],
  copilot: ["Individual ($10/mo)", "Business ($19/mo)", "Enterprise ($39/mo)"],
  claude: ["Free", "Pro ($20/mo)", "Team ($25/mo/seat)"],
  chatgpt: ["Free", "Plus ($20/mo)", "Team ($25/mo/seat)", "Enterprise"],
  gemini: ["Free", "Advanced ($20/mo)", "Business ($20/mo/seat)"],
  windsurf: ["Free", "Pro ($15/mo)", "Teams ($30/mo/seat)"],
};

const STEPS = ["Tools", "Spend", "Team"];

export default function SpendForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [selectedTools, setSelectedTools] = useState([]);
  const [toolData, setToolData] = useState({});
  const [teamInfo, setTeamInfo] = useState({ size: "", useCase: "" });

  const toggleTool = (id) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const updateTool = (id, field, value) => {
    setToolData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSubmit = () => {
    const tools = selectedTools.map((id) => {
      const tool = TOOLS.find((t) => t.id === id);
      const data = toolData[id] || {};
      return {
        id,
        name: tool.name,
        plan: data.plan || "",
        seats: parseInt(data.seats) || 1,
        monthlySpend: parseFloat(data.spend) || 0,
      };
    });
    onSubmit({ tools, teamSize: teamInfo.size, useCase: teamInfo.useCase });
  };

  return (
    <div style={styles.wrapper}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.navDot} />
          AuditAI
        </div>
        <div style={styles.navRight}>
          <span style={styles.navBadge}>Free Audit</span>
        </div>
      </nav>

      <div style={styles.container}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroBadge}>⚡ 60-second audit</div>
          <h1 style={styles.heroTitle}>
            Stop Overpaying
            <br />
            <span style={styles.heroGradient}>for AI Tools</span>
          </h1>
          <p style={styles.heroSub}>
            Teams save an average of <strong style={{ color: "#A78BFA" }}>$423/mo</strong> after their audit
          </p>
        </div>

        {/* Step Indicator */}
        <div style={styles.stepRow}>
          {STEPS.map((s, i) => (
            <div key={s} style={styles.stepItem}>
              <div
                style={{
                  ...styles.stepCircle,
                  background: i <= step ? "linear-gradient(135deg,#7C3AED,#06B6D4)" : "#1e1e2e",
                  border: i === step ? "2px solid #7C3AED" : "2px solid #2a2a3e",
                  color: i <= step ? "#fff" : "#555",
                }}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ ...styles.stepLabel, color: i === step ? "#A78BFA" : "#555" }}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div style={{ ...styles.stepLine, background: i < step ? "#7C3AED" : "#2a2a3e" }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0 — Select Tools */}
        {step === 0 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Which AI tools does your team use?</h2>
            <p style={styles.cardSub}>Select all that apply</p>
            <div style={styles.toolGrid}>
              {TOOLS.map((tool) => {
                const selected = selectedTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    style={{
                      ...styles.toolCard,
                      border: selected
                        ? `2px solid ${tool.color}`
                        : "2px solid #2a2a3e",
                      background: selected
                        ? `${tool.color}15`
                        : "#111122",
                      boxShadow: selected
                        ? `0 0 20px ${tool.color}30`
                        : "none",
                    }}
                  >
                    <span style={styles.toolIcon}>{tool.icon}</span>
                    <span style={styles.toolName}>{tool.name}</span>
                    {selected && (
                      <div style={{ ...styles.toolCheck, background: tool.color }}>✓</div>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              style={{
                ...styles.btnPrimary,
                opacity: selectedTools.length === 0 ? 0.4 : 1,
              }}
              onClick={() => selectedTools.length > 0 && setStep(1)}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 1 — Spend per tool */}
        {step === 1 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>How much are you spending?</h2>
            <p style={styles.cardSub}>Enter your current plan and monthly cost</p>
            <div style={styles.spendList}>
              {selectedTools.map((id) => {
                const tool = TOOLS.find((t) => t.id === id);
                const data = toolData[id] || {};
                return (
                  <div key={id} style={{ ...styles.spendCard, borderLeft: `3px solid ${tool.color}` }}>
                    <div style={styles.spendHeader}>
                      <span style={styles.toolIcon}>{tool.icon}</span>
                      <span style={{ ...styles.toolName, color: "#fff" }}>{tool.name}</span>
                    </div>
                    <div style={styles.spendFields}>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Current Plan</label>
                        <select
                          style={styles.select}
                          value={data.plan || ""}
                          onChange={(e) => updateTool(id, "plan", e.target.value)}
                        >
                          <option value="">Select plan...</option>
                          {(PLANS[id] || []).map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Seats / Users</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 5"
                          style={styles.input}
                          value={data.seats || ""}
                          onChange={(e) => updateTool(id, "seats", e.target.value)}
                        />
                      </div>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Monthly Spend ($)</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 100"
                          style={styles.input}
                          value={data.spend || ""}
                          onChange={(e) => updateTool(id, "spend", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(0)}>← Back</button>
              <button style={styles.btnPrimary} onClick={() => setStep(2)}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2 — Team Info */}
        {step === 2 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Tell us about your team</h2>
            <p style={styles.cardSub}>We'll personalize your audit results</p>
            <div style={styles.teamFields}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Team Size</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  style={{ ...styles.input, width: "100%" }}
                  value={teamInfo.size}
                  onChange={(e) => setTeamInfo({ ...teamInfo, size: e.target.value })}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Primary Use Case</label>
                <select
                  style={{ ...styles.select, width: "100%" }}
                  value={teamInfo.useCase}
                  onChange={(e) => setTeamInfo({ ...teamInfo, useCase: e.target.value })}
                >
                  <option value="">Select use case...</option>
                  <option value="Coding">Coding / Engineering</option>
                  <option value="Content">Content / Marketing</option>
                  <option value="Research">Research / Analysis</option>
                  <option value="Design">Design / Creative</option>
                  <option value="Operations">Operations / Productivity</option>
                </select>
              </div>
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnSecondary} onClick={() => setStep(1)}>← Back</button>
              <button
                style={{
                  ...styles.btnPrimary,
                  opacity: !teamInfo.size || !teamInfo.useCase ? 0.4 : 1,
                  background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                }}
                onClick={() => (teamInfo.size && teamInfo.useCase) && handleSubmit()}
              >
                🚀 Run My Audit
              </button>
            </div>
          </div>
        )}

        {/* Trust badges */}
        <div style={styles.trustRow}>
          <span style={styles.trustBadge}>🔒 No credit card required</span>
          <span style={styles.trustBadge}>⚡ Results in 10 seconds</span>
          <span style={styles.trustBadge}>🆓 100% Free</span>
        </div>
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
    position: "fixed",
    top: "-200px",
    left: "-200px",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, #7C3AED22 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob2: {
    position: "fixed",
    bottom: "-200px",
    right: "-200px",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, #06B6D422 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    borderBottom: "1px solid #1a1a2e",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#0A0A0F99",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    color: "#fff",
  },
  navDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
    display: "inline-block",
  },
  navRight: { display: "flex", gap: "12px", alignItems: "center" },
  navBadge: {
    fontSize: "12px",
    background: "#7C3AED22",
    color: "#A78BFA",
    border: "1px solid #7C3AED44",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  container: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "40px 20px 80px",
    position: "relative",
    zIndex: 1,
  },
  hero: { textAlign: "center", marginBottom: "40px" },
  heroBadge: {
    display: "inline-block",
    fontSize: "12px",
    background: "#06B6D422",
    color: "#67E8F9",
    border: "1px solid #06B6D444",
    padding: "6px 16px",
    borderRadius: "20px",
    marginBottom: "20px",
    letterSpacing: "0.5px",
  },
  heroTitle: {
    fontSize: "clamp(36px, 6vw, 56px)",
    fontWeight: "800",
    lineHeight: "1.1",
    margin: "0 0 16px",
    letterSpacing: "-2px",
  },
  heroGradient: {
    background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: { color: "#A1A1AA", fontSize: "16px", margin: "0" },
  stepRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0",
    marginBottom: "32px",
  },
  stepItem: { display: "flex", alignItems: "center", gap: "8px" },
  stepCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    transition: "all 0.3s",
  },
  stepLabel: { fontSize: "13px", fontWeight: "500", marginRight: "8px" },
  stepLine: { width: "40px", height: "2px", margin: "0 8px 0 0" },
  card: {
    background: "#111122",
    border: "1px solid #1e1e3a",
    borderRadius: "20px",
    padding: "32px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 60px #00000060",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
  },
  cardSub: { color: "#A1A1AA", fontSize: "14px", margin: "0 0 28px" },
  toolGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "12px",
    marginBottom: "28px",
  },
  toolCard: {
    padding: "20px 16px",
    borderRadius: "14px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    position: "relative",
  },
  toolIcon: { fontSize: "28px" },
  toolName: { fontSize: "13px", fontWeight: "600", color: "#D4D4D8" },
  toolCheck: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    color: "#fff",
  },
  spendList: { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" },
  spendCard: {
    background: "#0D0D1A",
    border: "1px solid #1e1e3a",
    borderRadius: "14px",
    padding: "20px",
  },
  spendHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" },
  spendFields: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "12px",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", color: "#71717A", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: {
    background: "#1a1a2e",
    border: "1px solid #2a2a4e",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    background: "#1a1a2e",
    border: "1px solid #2a2a4e",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  teamFields: { display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" },
  btnRow: { display: "flex", gap: "12px", justifyContent: "flex-end" },
  btnPrimary: {
    background: "linear-gradient(135deg, #7C3AED, #2563EB)",
    border: "none",
    borderRadius: "10px",
    padding: "12px 28px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "-0.3px",
  },
  btnSecondary: {
    background: "transparent",
    border: "1px solid #2a2a4e",
    borderRadius: "10px",
    padding: "12px 24px",
    color: "#A1A1AA",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
  },
  trustRow: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "24px",
  },
  trustBadge: {
    fontSize: "13px",
    color: "#52525B",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
};