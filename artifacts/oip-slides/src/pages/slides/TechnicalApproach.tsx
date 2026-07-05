export default function TechnicalApproach() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#EEF2F8" }}
    >
      <div className="absolute left-0 top-0 bottom-0" style={{ width: "0.35vw", background: "#9B6824" }} />

      <div className="absolute flex items-center justify-center" style={{ top: "2.5vh", right: "4vw", background: "rgba(155, 104, 36, 0.08)", border: "1px solid rgba(155, 104, 36, 0.25)", borderRadius: "4px", padding: "0.3vh 1vw" }}>
        <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.4vw", fontWeight: 600, color: "#9B6824" }}>03 / 05</span>
      </div>

      {/* Header */}
      <div className="absolute" style={{ top: "4vh", left: "6vw", right: "4vw" }}>
        <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.2vw", fontWeight: 600, letterSpacing: "0.06em", color: "#2E5D9B", marginBottom: "0.6vh", textTransform: "uppercase" }}>
          Technical Approach
        </div>
        <h2 style={{ fontFamily: "var(--font-display-family)", fontSize: "3.6vw", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em", color: "#1B2B44" }}>
          Architecture &amp; Process Flow
        </h2>
      </div>

      {/* Tech stack chips */}
      <div className="absolute flex" style={{ top: "21vh", left: "6vw", right: "4vw", gap: "1.5vw" }}>
        <div className="flex-1" style={{ background: "#FFFFFF", border: "1px solid rgba(46, 93, 155, 0.2)", borderRadius: "8px", padding: "1.5vh 1.6vw", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.2vw", fontWeight: 600, color: "#2E5D9B", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.6vh" }}>Algorithm</div>
          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "2.1vw", fontWeight: 700, color: "#9B6824", marginBottom: "0.4vh" }}>SGP4 / SDP4</div>
          <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878", lineHeight: 1.25 }}>NASA-standard orbital propagation for LEO / MEO / GEO / HEO</div>
        </div>

        <div className="flex-1" style={{ background: "#FFFFFF", border: "1px solid rgba(46, 93, 155, 0.2)", borderRadius: "8px", padding: "1.5vh 1.6vw", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.2vw", fontWeight: 600, color: "#2E5D9B", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.6vh" }}>Database</div>
          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "2.1vw", fontWeight: 700, color: "#9B6824", marginBottom: "0.4vh" }}>PostgreSQL</div>
          <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878", lineHeight: 1.25 }}>Drizzle ORM — satellites, debris, risk scores, collision events</div>
        </div>

        <div className="flex-1" style={{ background: "#FFFFFF", border: "1px solid rgba(46, 93, 155, 0.2)", borderRadius: "8px", padding: "1.5vh 1.6vw", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.2vw", fontWeight: 600, color: "#2E5D9B", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.6vh" }}>Tech Stack</div>
          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "2.1vw", fontWeight: 700, color: "#9B6824", marginBottom: "0.4vh" }}>React 19 + Node 24</div>
          <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878", lineHeight: 1.25 }}>Express 5 • TypeScript 5.9 • Tailwind CSS • Drizzle ORM</div>
        </div>
      </div>

      {/* Flow diagram label */}
      <div className="absolute" style={{ top: "47.5vh", left: "6vw" }}>
        <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.2vw", fontWeight: 600, letterSpacing: "0.06em", color: "#2E5D9B", textTransform: "uppercase", marginBottom: "0.8vh" }}>
          Process Flow Architecture
        </div>
      </div>

      {/* Process flow SVG */}
      <div className="absolute" style={{ top: "51vh", left: "6vw", right: "4vw", height: "42vh" }}>
        <svg width="100%" height="100%" viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arr" markerWidth="9" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 9 3.5, 0 7" fill="#9B6824" />
            </marker>
          </defs>

          <rect x="8" y="30" width="160" height="80" rx="6" fill="#FFFFFF" stroke="#CBD8E8" strokeWidth="1.5" />
          <text x="88" y="62" textAnchor="middle" fill="#1B2B44" fontSize="14" fontFamily="Space Grotesk" fontWeight="700">CelesTrak</text>
          <text x="88" y="84" textAnchor="middle" fill="#586878" fontSize="12" fontFamily="DM Sans">Live TLE API</text>
          <text x="88" y="101" textAnchor="middle" fill="#9AAABB" fontSize="11" fontFamily="DM Sans">TLE / JSON feed</text>

          <line x1="168" y1="70" x2="202" y2="70" stroke="#9B6824" strokeWidth="2" markerEnd="url(#arr)" />

          <rect x="202" y="30" width="160" height="80" rx="6" fill="#FFFFFF" stroke="#CBD8E8" strokeWidth="1.5" />
          <text x="282" y="62" textAnchor="middle" fill="#1B2B44" fontSize="14" fontFamily="Space Grotesk" fontWeight="700">TLE Parser</text>
          <text x="282" y="84" textAnchor="middle" fill="#586878" fontSize="12" fontFamily="DM Sans">Orbital element</text>
          <text x="282" y="101" textAnchor="middle" fill="#9AAABB" fontSize="11" fontFamily="DM Sans">extraction</text>

          <line x1="362" y1="70" x2="396" y2="70" stroke="#9B6824" strokeWidth="2" markerEnd="url(#arr)" />

          <rect x="396" y="22" width="200" height="96" rx="6" fill="#F4F7FC" stroke="#2E5D9B" strokeWidth="2" />
          <text x="496" y="57" textAnchor="middle" fill="#2E5D9B" fontSize="14" fontFamily="Space Grotesk" fontWeight="700">SGP4 Engine</text>
          <text x="496" y="79" textAnchor="middle" fill="#586878" fontSize="12" fontFamily="DM Sans">Position &amp; velocity</text>
          <text x="496" y="96" textAnchor="middle" fill="#9AAABB" fontSize="11" fontFamily="DM Sans">propagation</text>

          <line x1="596" y1="70" x2="630" y2="70" stroke="#9B6824" strokeWidth="2" markerEnd="url(#arr)" />

          <rect x="630" y="30" width="160" height="80" rx="6" fill="#FFFFFF" stroke="#CBD8E8" strokeWidth="1.5" />
          <text x="710" y="62" textAnchor="middle" fill="#1B2B44" fontSize="14" fontFamily="Space Grotesk" fontWeight="700">Risk Engine</text>
          <text x="710" y="84" textAnchor="middle" fill="#586878" fontSize="12" fontFamily="DM Sans">5-factor scoring</text>
          <text x="710" y="101" textAnchor="middle" fill="#9AAABB" fontSize="11" fontFamily="DM Sans">0–100 scale</text>

          <line x1="790" y1="70" x2="824" y2="70" stroke="#9B6824" strokeWidth="2" markerEnd="url(#arr)" />

          <rect x="824" y="30" width="168" height="80" rx="6" fill="#FFFFFF" stroke="#CBD8E8" strokeWidth="1.5" />
          <text x="908" y="62" textAnchor="middle" fill="#1B2B44" fontSize="14" fontFamily="Space Grotesk" fontWeight="700">OIP Dashboard</text>
          <text x="908" y="84" textAnchor="middle" fill="#586878" fontSize="12" fontFamily="DM Sans">Analytics, risk table,</text>
          <text x="908" y="101" textAnchor="middle" fill="#9AAABB" fontSize="11" fontFamily="DM Sans">collision forecast</text>

          <text x="88" y="152" textAnchor="middle" fill="#2E5D9B" fontSize="10" fontFamily="Space Grotesk" fontWeight="600">DATA SOURCE</text>
          <text x="282" y="152" textAnchor="middle" fill="#2E5D9B" fontSize="10" fontFamily="Space Grotesk" fontWeight="600">INGESTION</text>
          <text x="496" y="152" textAnchor="middle" fill="#9B6824" fontSize="10" fontFamily="Space Grotesk" fontWeight="600">COMPUTATION</text>
          <text x="710" y="152" textAnchor="middle" fill="#2E5D9B" fontSize="10" fontFamily="Space Grotesk" fontWeight="600">ANALYSIS</text>
          <text x="908" y="152" textAnchor="middle" fill="#2E5D9B" fontSize="10" fontFamily="Space Grotesk" fontWeight="600">VISUALIZATION</text>
        </svg>
      </div>
    </div>
  );
}
