export default function FeasibilityViability() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0A1628" }}
    >
      {/* Left amber accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: "0.4vw", background: "#E8A020" }}
      />

      {/* Slide number badge */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: "3.5vh",
          right: "5vw",
          background: "rgba(232, 160, 32, 0.12)",
          border: "1px solid rgba(232, 160, 32, 0.35)",
          borderRadius: "4px",
          padding: "0.5vh 1.2vw",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "1.8vw",
            fontWeight: 600,
            color: "#E8A020",
            letterSpacing: "0.1em",
          }}
        >
          04 / 05
        </span>
      </div>

      {/* Header */}
      <div
        className="absolute"
        style={{ top: "6vh", left: "7vw", right: "5vw" }}
      >
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "1.6vw",
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: "#1B6CA8",
            marginBottom: "1vh",
            textTransform: "uppercase",
          }}
        >
          Feasibility &amp; Viability
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "4.5vw",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#EDF2F7",
          }}
        >
          Potential, Challenges &amp; Strategies
        </h2>
      </div>

      {/* Three columns */}
      <div
        className="absolute flex"
        style={{ top: "26vh", left: "7vw", right: "5vw", bottom: "6vh", gap: "2vw" }}
      >
        {/* Technical column */}
        <div
          className="flex flex-col flex-1"
          style={{
            background: "rgba(15, 32, 64, 0.7)",
            border: "1px solid rgba(27, 108, 168, 0.4)",
            borderRadius: "8px",
            padding: "2.5vh 2vw",
            gap: "2vh",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.4vw",
              fontWeight: 700,
              color: "#7AB8DC",
              paddingBottom: "1.5vh",
              borderBottom: "1px solid rgba(27, 108, 168, 0.3)",
            }}
          >
            Technical
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.7vw",
                fontWeight: 600,
                color: "#E8A020",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6vh",
              }}
            >
              Feasibility — High
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#CBD5E0",
                lineHeight: 1.4,
              }}
            >
              Open TLE APIs, proven SGP4 algorithm (NASA-standard), and a mature TypeScript stack make this fully buildable
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.7vw",
                fontWeight: 600,
                color: "#E8AAAA",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6vh",
              }}
            >
              Challenge
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#CBD5E0",
                lineHeight: 1.4,
              }}
            >
              TLE data refreshes every few hours — stale data reduces propagation accuracy for recent conjunction events
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.7vw",
                fontWeight: 600,
                color: "#A8E8B0",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6vh",
              }}
            >
              Strategy
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#CBD5E0",
                lineHeight: 1.4,
              }}
            >
              Incremental sync with configurable auto-scheduler; server-side caching minimizes redundant API calls
            </p>
          </div>
        </div>

        {/* Financial column */}
        <div
          className="flex flex-col flex-1"
          style={{
            background: "rgba(15, 32, 64, 0.7)",
            border: "1px solid rgba(27, 108, 168, 0.4)",
            borderRadius: "8px",
            padding: "2.5vh 2vw",
            gap: "2vh",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.4vw",
              fontWeight: 700,
              color: "#7AB8DC",
              paddingBottom: "1.5vh",
              borderBottom: "1px solid rgba(27, 108, 168, 0.3)",
            }}
          >
            Financial
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.7vw",
                fontWeight: 600,
                color: "#E8A020",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6vh",
              }}
            >
              Feasibility — Medium-Low
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#CBD5E0",
                lineHeight: 1.4,
              }}
            >
              Zero licensing cost — open-source stack and free CelesTrak data keep development cost minimal
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.7vw",
                fontWeight: 600,
                color: "#E8AAAA",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6vh",
              }}
            >
              Challenge
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#CBD5E0",
                lineHeight: 1.4,
              }}
            >
              Database and compute costs scale with object count; ingesting full debris catalog requires significant storage
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.7vw",
                fontWeight: 600,
                color: "#A8E8B0",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6vh",
              }}
            >
              Strategy
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#CBD5E0",
                lineHeight: 1.4,
              }}
            >
              Tiered data model: track high-priority objects in full, archive low-risk debris at lower resolution
            </p>
          </div>
        </div>

        {/* Operational column */}
        <div
          className="flex flex-col flex-1"
          style={{
            background: "rgba(15, 32, 64, 0.7)",
            border: "1px solid rgba(27, 108, 168, 0.4)",
            borderRadius: "8px",
            padding: "2.5vh 2vw",
            gap: "2vh",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.4vw",
              fontWeight: 700,
              color: "#7AB8DC",
              paddingBottom: "1.5vh",
              borderBottom: "1px solid rgba(27, 108, 168, 0.3)",
            }}
          >
            Operational
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.7vw",
                fontWeight: 600,
                color: "#E8A020",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6vh",
              }}
            >
              Feasibility — High
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#CBD5E0",
                lineHeight: 1.4,
              }}
            >
              Browser-based deployment — no installation required; accessible to satellite operators, researchers, and agencies
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.7vw",
                fontWeight: 600,
                color: "#E8AAAA",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6vh",
              }}
            >
              Challenge
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#CBD5E0",
                lineHeight: 1.4,
              }}
            >
              Adoption requires trust in risk scores; users accustomed to specialized tools may need onboarding
            </p>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.7vw",
                fontWeight: 600,
                color: "#A8E8B0",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6vh",
              }}
            >
              Strategy
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#CBD5E0",
                lineHeight: 1.4,
              }}
            >
              Transparent scoring breakdown per object; risk factors visible alongside each score for auditability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
