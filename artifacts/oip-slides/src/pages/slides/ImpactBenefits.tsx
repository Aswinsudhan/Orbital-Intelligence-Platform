export default function ImpactBenefits() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#EEF2F8" }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: "0.35vw", background: "#9B6824" }}
      />

      {/* Slide number badge */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: "2.5vh",
          right: "4vw",
          background: "rgba(155, 104, 36, 0.08)",
          border: "1px solid rgba(155, 104, 36, 0.25)",
          borderRadius: "4px",
          padding: "0.3vh 1vw",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "1.4vw",
            fontWeight: 600,
            color: "#9B6824",
          }}
        >
          05 / 05
        </span>
      </div>

      {/* Header */}
      <div className="absolute" style={{ top: "4vh", left: "6vw", right: "4vw" }}>
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "1.2vw",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "#2E5D9B",
            marginBottom: "0.6vh",
            textTransform: "uppercase",
          }}
        >
          Impact &amp; Benefits
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.4vw",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            color: "#1B2B44",
          }}
        >
          Who Benefits &amp; How
        </h2>
      </div>

      {/* Two-column body */}
      <div
        className="absolute flex"
        style={{ top: "20vh", left: "6vw", right: "4vw", bottom: "3vh", gap: "3vw" }}
      >
        {/* Left — Impact */}
        <div className="flex flex-col" style={{ width: "44%", gap: "1vh" }}>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "1.7vw",
              fontWeight: 600,
              color: "#2E5D9B",
              marginBottom: "0.2vh",
            }}
          >
            Impact on Target Audience
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(62, 138, 80, 0.25)",
              borderRadius: "6px",
              padding: "1.1vh 1.4vw",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.5vw",
                fontWeight: 600,
                color: "#3E8A50",
                marginBottom: "0.3vh",
              }}
            >
              Improvement
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#2A3A54", lineHeight: 1.25, margin: 0 }}>
              Satellite operators receive advance warning of conjunction events, enabling earlier avoidance maneuvers
            </p>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(62, 138, 80, 0.25)",
              borderRadius: "6px",
              padding: "1.1vh 1.4vw",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.5vw",
                fontWeight: 600,
                color: "#3E8A50",
                marginBottom: "0.3vh",
              }}
            >
              New Opportunities
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#2A3A54", lineHeight: 1.25, margin: 0 }}>
              Researchers gain open access to structured orbital analytics, debris trends, and congestion history
            </p>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(176, 80, 80, 0.22)",
              borderRadius: "6px",
              padding: "1.1vh 1.4vw",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.5vw",
                fontWeight: 600,
                color: "#B05050",
                marginBottom: "0.3vh",
              }}
            >
              Consideration
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#2A3A54", lineHeight: 1.25, margin: 0 }}>
              Adoption requires integration with existing ground station workflows; initial transition cost applies
            </p>
          </div>
        </div>

        {/* Right — Benefits */}
        <div className="flex flex-col" style={{ width: "52%", gap: "1vh" }}>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "1.7vw",
              fontWeight: 600,
              color: "#2E5D9B",
              marginBottom: "0.2vh",
            }}
          >
            Benefits of the Solution
          </div>

          {/* Social */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(46, 93, 155, 0.2)",
              borderRadius: "6px",
              padding: "1.1vh 1.6vw",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center" style={{ marginBottom: "0.5vh", gap: "0.8vw" }}>
              <div style={{ width: "0.35vw", height: "2.8vh", background: "#2E5D9B", borderRadius: "2px", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.8vw", fontWeight: 700, color: "#1B2B44" }}>
                Social
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5vh 1.2vw" }}>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878" }}>Improved access to orbital data</span>
              <span style={{ color: "#CBD8E8", fontSize: "1.6vw" }}>•</span>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878" }}>Space safety democratized</span>
            </div>
          </div>

          {/* Economic */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(46, 93, 155, 0.2)",
              borderRadius: "6px",
              padding: "1.1vh 1.6vw",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center" style={{ marginBottom: "0.5vh", gap: "0.8vw" }}>
              <div style={{ width: "0.35vw", height: "2.8vh", background: "#9B6824", borderRadius: "2px", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.8vw", fontWeight: 700, color: "#1B2B44" }}>
                Economic
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5vh 1.2vw" }}>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878" }}>Reduced satellite loss risk</span>
              <span style={{ color: "#CBD8E8", fontSize: "1.6vw" }}>•</span>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878" }}>Lower cost vs. proprietary tools</span>
            </div>
          </div>

          {/* Environmental */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(46, 93, 155, 0.2)",
              borderRadius: "6px",
              padding: "1.1vh 1.6vw",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center" style={{ marginBottom: "0.5vh", gap: "0.8vw" }}>
              <div style={{ width: "0.35vw", height: "2.8vh", background: "#3E8A50", borderRadius: "2px", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.8vw", fontWeight: 700, color: "#1B2B44" }}>
                Environmental
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5vh 1.2vw" }}>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878" }}>Supports debris mitigation decisions</span>
              <span style={{ color: "#CBD8E8", fontSize: "1.6vw" }}>•</span>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878" }}>Promotes sustainable orbit use</span>
            </div>
          </div>

          {/* Target Audience */}
          <div
            style={{
              background: "rgba(155, 104, 36, 0.06)",
              border: "1px solid rgba(155, 104, 36, 0.2)",
              borderRadius: "6px",
              padding: "1.1vh 1.6vw",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.3vw",
                fontWeight: 600,
                color: "#9B6824",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "0.4vh",
              }}
            >
              Target Audience
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.7vw",
                color: "#2A3A54",
                lineHeight: 1.3,
              }}
            >
              Satellite operators&nbsp;•&nbsp;Space agencies
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.7vw",
                color: "#2A3A54",
                lineHeight: 1.3,
              }}
            >
              Research institutions&nbsp;•&nbsp;Debris mitigation bodies
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
