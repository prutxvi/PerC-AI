import { useState } from "react";
import "./App.css";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "./Typewriter";

function App() {
  // Read API base from Vite env var. Accept either VITE_API_BASE or VITE_API_URL.
  const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const [itemsInput, setItemsInput] = useState("A,B,C");
  const [r, setR] = useState(2);
  const [type, setType] = useState("perm");
  const [explanationMode, setExplanationMode] = useState("Tutor");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  const parsedItems = itemsInput.split(",").map((s) => s.trim()).filter((s) => s);

  const handlePreset = (val) => setItemsInput(val);

  const handleSolve = async () => {
    setLoading(true);
    setError("");
    setData(null);
    setShowExplanation(false);
    try {
      const res = await fetch(`${API_BASE}/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: parsedItems,
          r: Number(r),
          calculation_type: type,
          explanation_mode: explanationMode,
        }),
      });
      if (!res.ok) throw new Error("Backend error");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="web-container">
      <div className="content-wrapper">
        {/* HEADER */}
        <header className="web-header">
          <div className="logo">
            <span className="logo-icon">∑</span>
            <span>PerC AI</span>
          </div>
          <div className="powered-by">Learning Group 3</div>
        </header>

        {/* HERO SECTION */}
        <section className="hero-section">
          <h1 className="title">
            Combinatorics <span className="highlight">Intelligence</span>
          </h1>
          <p className="subtitle">
            Advanced permutation & combination analysis with AI-powered explanations
          </p>
        </section>

        {/* MAIN CONTENT - CENTERED */}
        <main className="desktop-grid">
          {/* LEFT COLUMN: CONFIG */}
          <div className="left-col">
            <section className="config-card">
              <div className="card-header-label">⚙️ Configuration</div>
              
              <div className="input-group">
                <label>Input Set</label>
                <div className="input-wrapper">
                  <input
                    value={itemsInput}
                    onChange={(e) => setItemsInput(e.target.value)}
                    placeholder="e.g. A, B, C"
                  />
                  <div className="pill-presets">
                    <button onClick={() => handlePreset("A,B,C")}>ABC</button>
                    <button onClick={() => handlePreset("1,2,3,4")}>1234</button>
                    <button onClick={() => handlePreset("Red,Blue,Green")}>Colors</button>
                  </div>
                </div>
              </div>

              <div className="split-row">
                <div className="input-group">
                  <label>Select (r)</label>
                  <input
                    type="number"
                    min="1"
                    value={r}
                    onChange={(e) => setR(e.target.value)}
                  />
                </div>
                <div className="input-group">
                   <label>Mode</label>
                   <select value={explanationMode} onChange={(e) => setExplanationMode(e.target.value)}>
                     <option value="Tutor">Tutor</option>
                     <option value="Expert">Expert</option>
                   </select>
                </div>
              </div>

               <div className="toggle-group">
                  <button
                    className={type === "perm" ? "active" : ""}
                    onClick={() => setType("perm")}
                  >
                    📊 Permutation
                  </button>
                  <button
                    className={type === "comb" ? "active" : ""}
                    onClick={() => setType("comb")}
                  >
                    🔄 Combination
                  </button>
              </div>

              <button 
                className="solve-btn" 
                onClick={handleSolve}
                disabled={loading || !itemsInput}
              >
                {loading ? "⏳ Analyzing..." : "🚀 Run Analysis"}
              </button>
              
              {error && <div className="error-banner">❌ {error}</div>}
            </section>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="right-col">
            <AnimatePresence mode="wait">
              {data ? (
                <motion.div 
                  className="results-wrapper"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {/* KEY METRICS */}
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <span className="label">Total Outcomes</span>
                      <span className="value">{data.total_count}</span>
                    </div>
                    <div className="metric-card">
                      <span className="label">Calculation Type</span>
                      <span className="value text-sm">
                        {data.calculation_type === "perm" ? "P(n,r)" : "C(n,r)"}
                      </span>
                    </div>
                  </div>

                  {/* VISUAL GRID */}
                  <div className="visual-container">
                    <div className="section-header">
                      <h3>📋 Result Explorer</h3>
                      <span className="badge-count">{data.sample_results.length} Samples</span>
                    </div>
                    <div className="visual-grid">
                      {data.sample_results.map((res, i) => (
                        <motion.div 
                          key={i} 
                          className="visual-chip"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <span className="index">#{i+1}</span>
                          <span className="content">
                            {Array.isArray(res) ? res.join(" → ") : res}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* AI EXPLANATION */}
                  <div className="ai-wrapper">
                    {!showExplanation ? (
                      <button className="ai-trigger-btn" onClick={() => setShowExplanation(true)}>
                        <span className="ai-icon">✨</span>
                        <div className="text-left">
                          <div className="btn-title">Generate AI Explanation</div>
                          <div className="btn-sub">Get a step-by-step breakdown in {explanationMode} mode</div>
                        </div>
                      </button>
                    ) : (
                      <motion.div 
                        className="ai-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="ai-header">
                          <div className="ai-title">
                            <span className="icon">🤖</span>
                            <span>AI Analysis</span>
                          </div>
                          <button className="close-btn" onClick={() => setShowExplanation(false)}>Close</button>
                        </div>
                        <div className="ai-body">
                          <Typewriter text={data.ai_explanation} speed={15} />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="empty-placeholder">
                  <div className="placeholder-content">
                    <div className="icon">⚡</div>
                    <h3>Ready to Analyze</h3>
                    <p>Configure your problem on the left and click "Run Analysis" to see results here.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <footer className="web-footer">
        <p style={{ marginBottom: '0.5rem' }}>Learning Group 3 - PerC AI Project</p>
        <p style={{ marginBottom: '0.8rem', fontSize: '0.9rem' }}>
          Team Members:
        </p>
        <div style={{ fontSize: '0.85rem', lineHeight: '1.8', color: '#c0c0d0' }}>
          <p style={{ margin: '0.3rem 0' }}>• VOOTUKURI KEERTHAN (6277)</p>
          <p style={{ margin: '0.3rem 0' }}>• VASIREDDY AKHIL (6269)</p>
          <p style={{ margin: '0.3rem 0' }}>• VARRI HANUMAN (4162)</p>
          <p style={{ margin: '0.3rem 0' }}>• TOGANTI PRUTHVI RAJ (4157)</p>
          <p style={{ margin: '0.3rem 0' }}>• NYAYAM SRI CHARAN REDDY (6288)</p>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#808090' }}>Built with React, FastAPI & AI Technology</p>
      </footer>
    </div>
  );
}

export default App;
