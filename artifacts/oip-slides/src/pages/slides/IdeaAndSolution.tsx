export default function IdeaAndSolution() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#EEF2F8" }}
    >
      <div className="absolute left-0 top-0 bottom-0" style={{ width: "0.35vw", background: "#9B6824" }} />

      <div className="absolute flex items-center justify-center" style={{ top: "2.5vh", right: "4vw", background: "rgba(155, 104, 36, 0.08)", border: "1px solid rgba(155, 104, 36, 0.25)", borderRadius: "4px", padding: "0.3vh 1vw" }}>
        <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.4vw", fontWeight: 600, color: "#9B6824" }}>02 / 05</span>
      </div>

      {/* Header */}
      <div className="absolute" style={{ top: "4vh", left: "6vw", right: "4vw" }}>
        <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.2vw", fontWeight: 600, letterSpacing: "0.06em", color: "#2E5D9B", marginBottom: "0.6vh", textTransform: "uppercase" }}>
          Idea &amp; Proposed Solution
        </div>
        <h2 style={{ fontFamily: "var(--font-display-family)", fontSize: "3.6vw", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em", color: "#1B2B44" }}>
          One Platform. Complete Orbital Picture.
        </h2>
      </div>

      {/* Two-column body */}
      <div className="absolute flex" style={{ top: "20vh", left: "6vw", right: "4vw", bottom: "3vh", gap: "3.5vw" }}>
        {/* Left */}
        <div className="flex flex-col" style={{ width: "47%", gap: "1.5vh" }}>
          <div style={{ background: "rgba(46, 93, 155, 0.06)", border: "1px solid rgba(46, 93, 155, 0.2)", borderRadius: "8px", padding: "1.6vh 1.6vw" }}>
            <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.7vw", fontWeight: 600, color: "#2E5D9B", marginBottom: "0.6vh" }}>Proposed Solution</div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", lineHeight: 1.25, color: "#2A3A54", margin: 0 }}>
              OIP is a web-based orbital intelligence platform that consolidates
              satellite tracking, debris monitoring, multi-factor risk scoring,
              and collision prediction into a single operator-facing interface.
            </p>
          </div>

          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.5vw", fontWeight: 600, color: "#9B6824", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Unique Value Propositions
          </div>

          <div className="flex flex-col" style={{ gap: "1.1vh" }}>
            <div className="flex items-start" style={{ gap: "0.9vw" }}>
              <div style={{ width: "0.35vw", height: "3.4vh", background: "#9B6824", borderRadius: "2px", flexShrink: 0, marginTop: "0.3vh" }} />
              <div>
                <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.8vw", fontWeight: 600, color: "#1B2B44" }}>Unified Dashboard</div>
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878", lineHeight: 1.2 }}>Satellites, debris, and risk in one view</div>
              </div>
            </div>

            <div className="flex items-start" style={{ gap: "0.9vw" }}>
              <div style={{ width: "0.35vw", height: "3.4vh", background: "#9B6824", borderRadius: "2px", flexShrink: 0, marginTop: "0.3vh" }} />
              <div>
                <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.8vw", fontWeight: 600, color: "#1B2B44" }}>On-Demand Sync</div>
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878", lineHeight: 1.2 }}>Manual or scheduled live TLE refresh</div>
              </div>
            </div>

            <div className="flex items-start" style={{ gap: "0.9vw" }}>
              <div style={{ width: "0.35vw", height: "3.4vh", background: "#9B6824", borderRadius: "2px", flexShrink: 0, marginTop: "0.3vh" }} />
              <div>
                <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.8vw", fontWeight: 600, color: "#1B2B44" }}>Predictive Risk Engine</div>
                <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878", lineHeight: 1.2 }}>5-factor scoring: proximity, congestion, age, eccentricity, frequency</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col" style={{ width: "49%", gap: "1.5vh" }}>
          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.7vw", fontWeight: 600, color: "#2E5D9B" }}>How It Is Implemented</div>

          <div className="flex flex-col" style={{ gap: "1.1vh" }}>
            <div className="flex items-start" style={{ gap: "0.9vw" }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2E5D9B", flexShrink: 0, marginTop: "0.2vh" }}>01</span>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#2A3A54", lineHeight: 1.25 }}>
                CelesTrak API fetches live Two-Line Element sets for all tracked objects
              </span>
            </div>
            <div className="flex items-start" style={{ gap: "0.9vw" }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2E5D9B", flexShrink: 0, marginTop: "0.2vh" }}>02</span>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#2A3A54", lineHeight: 1.25 }}>
                SGP4 propagation computes real-time orbital positions, altitude, and velocity
              </span>
            </div>
            <div className="flex items-start" style={{ gap: "0.9vw" }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2E5D9B", flexShrink: 0, marginTop: "0.2vh" }}>03</span>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#2A3A54", lineHeight: 1.25 }}>
                Risk engine scores objects 0–100 across Low, Medium, High, and Critical bands
              </span>
            </div>
            <div className="flex items-start" style={{ gap: "0.9vw" }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.6vw", fontWeight: 700, color: "#2E5D9B", flexShrink: 0, marginTop: "0.2vh" }}>04</span>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#2A3A54", lineHeight: 1.25 }}>
                Collision prediction identifies closest-approach pairs and time-to-event windows
              </span>
            </div>
          </div>

          <div style={{ background: "rgba(155, 104, 36, 0.06)", border: "1px solid rgba(155, 104, 36, 0.22)", borderRadius: "8px", padding: "1.4vh 1.4vw" }}>
            <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.5vw", fontWeight: 600, color: "#9B6824", marginBottom: "0.5vh" }}>Problem Resolution</div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#586878", lineHeight: 1.25, margin: 0 }}>
              OIP replaces fragmented, reactive workflows with a single real-time
              interface — shifting orbital safety from incident response to
              continuous, data-driven monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
