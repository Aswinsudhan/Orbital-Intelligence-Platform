export default function FeasibilityViability() {
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
          top: "3vh",
          right: "4vw",
          background: "rgba(155, 104, 36, 0.08)",
          border: "1px solid rgba(155, 104, 36, 0.25)",
          borderRadius: "4px",
          padding: "0.4vh 1vw",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "1.5vw",
            fontWeight: 600,
            color: "#9B6824",
          }}
        >
          04 / 05
        </span>
      </div>

      {/* Header */}
      <div className="absolute" style={{ top: "5vh", left: "6vw", right: "4vw" }}>
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "1.3vw",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#2E5D9B",
            marginBottom: "0.8vh",
            textTransform: "uppercase",
          }}
        >
          Feasibility &amp; Viability
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "3.8vw",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: "#1B2B44",
          }}
        >
          Potential, Challenges &amp; Strategies
        </h2>
      </div>

      {/* Three columns */}
      <div
        className="absolute flex"
        style={{ top: "23vh", left: "6vw", right: "4vw", bottom: "4vh", gap: "1.8vw" }}
      >
        {/* Technical */}
        <div
          className="flex flex-col flex-1"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(46, 93, 155, 0.2)",
            borderRadius: "8px",
            padding: "2.2vh 1.8vw",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            gap: "1.8vh",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.2vw",
              fontWeight: 700,
              color: "#2E5D9B",
              paddingBottom: "1.2vh",
              borderBottom: "1px solid rgba(46, 93, 155, 0.15)",
            }}
          >
            Technical
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 600,
                color: "#9B6824",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5vh",
              }}
            >
              Feasibility — High
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", color: "#2A3A54", lineHeight: 1.3 }}>
              Open TLE APIs, proven SGP4 algorithm, and a mature TypeScript stack make this fully buildable
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 600,
                color: "#B05050",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5vh",
              }}
            >
              Challenge
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", color: "#2A3A54", lineHeight: 1.3 }}>
              TLE data refreshes every few hours — stale data reduces propagation accuracy for recent conjunctions
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 600,
                color: "#3E8A50",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5vh",
              }}
            >
              Strategy
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", color: "#2A3A54", lineHeight: 1.3 }}>
              Incremental sync with configurable auto-scheduler; server-side caching reduces redundant API calls
            </p>
          </div>
        </div>

        {/* Financial */}
        <div
          className="flex flex-col flex-1"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(46, 93, 155, 0.2)",
            borderRadius: "8px",
            padding: "2.2vh 1.8vw",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            gap: "1.8vh",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.2vw",
              fontWeight: 700,
              color: "#2E5D9B",
              paddingBottom: "1.2vh",
              borderBottom: "1px solid rgba(46, 93, 155, 0.15)",
            }}
          >
            Financial
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 600,
                color: "#9B6824",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5vh",
              }}
            >
              Feasibility — Medium
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", color: "#2A3A54", lineHeight: 1.3 }}>
              Zero licensing cost — open-source stack and free CelesTrak data keep development cost minimal
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 600,
                color: "#B05050",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5vh",
              }}
            >
              Challenge
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", color: "#2A3A54", lineHeight: 1.3 }}>
              Database and compute costs scale with object count; full debris catalog ingestion requires significant storage
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 600,
                color: "#3E8A50",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5vh",
              }}
            >
              Strategy
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", color: "#2A3A54", lineHeight: 1.3 }}>
              Tiered data model: track high-priority objects in full, archive low-risk debris at lower resolution
            </p>
          </div>
        </div>

        {/* Operational */}
        <div
          className="flex flex-col flex-1"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(46, 93, 155, 0.2)",
            borderRadius: "8px",
            padding: "2.2vh 1.8vw",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            gap: "1.8vh",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.2vw",
              fontWeight: 700,
              color: "#2E5D9B",
              paddingBottom: "1.2vh",
              borderBottom: "1px solid rgba(46, 93, 155, 0.15)",
            }}
          >
            Operational
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 600,
                color: "#9B6824",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5vh",
              }}
            >
              Feasibility — High
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", color: "#2A3A54", lineHeight: 1.3 }}>
              Browser-based deployment — no installation required; accessible to operators, researchers, and agencies
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 600,
                color: "#B05050",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5vh",
              }}
            >
              Challenge
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", color: "#2A3A54", lineHeight: 1.3 }}>
              Adoption requires trust in risk scores; users accustomed to specialized tools may need onboarding
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.4vw",
                fontWeight: 600,
                color: "#3E8A50",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5vh",
              }}
            >
              Strategy
            </div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", color: "#2A3A54", lineHeight: 1.3 }}>
              Transparent scoring breakdown per object; risk factors visible alongside each score for auditability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
