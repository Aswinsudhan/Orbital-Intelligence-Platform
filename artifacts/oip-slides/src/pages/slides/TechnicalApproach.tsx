export default function TechnicalApproach() {
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
          03 / 05
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
          Technical Approach
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
          Architecture &amp; Process Flow
        </h2>
      </div>

      {/* Tech stack chips row */}
      <div
        className="absolute flex"
        style={{ top: "26vh", left: "7vw", right: "5vw", gap: "2vw" }}
      >
        {/* Algorithm chip */}
        <div
          className="flex-1"
          style={{
            background: "rgba(15, 32, 64, 0.9)",
            border: "1px solid rgba(27, 108, 168, 0.4)",
            borderRadius: "8px",
            padding: "2vh 2vw",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "1.6vw",
              fontWeight: 600,
              color: "#7AB8DC",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1vh",
            }}
          >
            Algorithm
          </div>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.5vw",
              fontWeight: 700,
              color: "#E8A020",
              marginBottom: "0.6vh",
            }}
          >
            SGP4 / SDP4
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2vw",
              color: "#7A90A8",
            }}
          >
            NASA-standard orbital propagation model for LEO/MEO/GEO/HEO
          </div>
        </div>

        {/* Database chip */}
        <div
          className="flex-1"
          style={{
            background: "rgba(15, 32, 64, 0.9)",
            border: "1px solid rgba(27, 108, 168, 0.4)",
            borderRadius: "8px",
            padding: "2vh 2vw",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "1.6vw",
              fontWeight: 600,
              color: "#7AB8DC",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1vh",
            }}
          >
            Database
          </div>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.5vw",
              fontWeight: 700,
              color: "#E8A020",
              marginBottom: "0.6vh",
            }}
          >
            PostgreSQL
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2vw",
              color: "#7A90A8",
            }}
          >
            Drizzle ORM — satellites, debris, risk scores, collision events
          </div>
        </div>

        {/* Tech stack chip */}
        <div
          className="flex-1"
          style={{
            background: "rgba(15, 32, 64, 0.9)",
            border: "1px solid rgba(27, 108, 168, 0.4)",
            borderRadius: "8px",
            padding: "2vh 2vw",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "1.6vw",
              fontWeight: 600,
              color: "#7AB8DC",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1vh",
            }}
          >
            Tech Stack
          </div>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.5vw",
              fontWeight: 700,
              color: "#E8A020",
              marginBottom: "0.6vh",
            }}
          >
            React 19 + Node.js 24
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2vw",
              color: "#7A90A8",
            }}
          >
            Express 5 • TypeScript 5.9 • Tailwind CSS • Drizzle ORM
          </div>
        </div>
      </div>

      {/* Process flow section label */}
      <div
        className="absolute"
        style={{ top: "52vh", left: "7vw" }}
      >
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "1.6vw",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: "#1B6CA8",
            textTransform: "uppercase",
            marginBottom: "1.5vh",
          }}
        >
          Process Flow Architecture
        </div>
      </div>

      {/* Process flow SVG diagram */}
      <div
        className="absolute"
        style={{ top: "57vh", left: "7vw", right: "5vw", height: "34vh" }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#E8A020" />
            </marker>
          </defs>

          {/* Box 1 — CelesTrak API */}
          <rect x="10" y="40" width="155" height="80" rx="6" fill="#0F2040" stroke="#1B6CA8" strokeWidth="1.5" />
          <text x="87" y="72" textAnchor="middle" fill="#EDF2F7" fontSize="15" fontFamily="Space Grotesk" fontWeight="700">CelesTrak</text>
          <text x="87" y="95" textAnchor="middle" fill="#7A90A8" fontSize="12" fontFamily="DM Sans">Live TLE API</text>
          <text x="87" y="112" textAnchor="middle" fill="#4A6080" fontSize="11" fontFamily="DM Sans">TLE/JSON feed</text>

          {/* Arrow 1 → 2 */}
          <line x1="165" y1="80" x2="200" y2="80" stroke="#E8A020" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Box 2 — TLE Parser */}
          <rect x="200" y="40" width="155" height="80" rx="6" fill="#0F2040" stroke="#1B6CA8" strokeWidth="1.5" />
          <text x="277" y="72" textAnchor="middle" fill="#EDF2F7" fontSize="15" fontFamily="Space Grotesk" fontWeight="700">TLE Parser</text>
          <text x="277" y="95" textAnchor="middle" fill="#7A90A8" fontSize="12" fontFamily="DM Sans">Orbital element</text>
          <text x="277" y="112" textAnchor="middle" fill="#4A6080" fontSize="11" fontFamily="DM Sans">extraction</text>

          {/* Arrow 2 → 3 */}
          <line x1="355" y1="80" x2="390" y2="80" stroke="#E8A020" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Box 3 — SGP4 Engine */}
          <rect x="390" y="40" width="155" height="80" rx="6" fill="#0F2040" stroke="#E8A020" strokeWidth="2" />
          <text x="467" y="72" textAnchor="middle" fill="#E8A020" fontSize="15" fontFamily="Space Grotesk" fontWeight="700">SGP4 Engine</text>
          <text x="467" y="95" textAnchor="middle" fill="#7A90A8" fontSize="12" fontFamily="DM Sans">Position &amp; velocity</text>
          <text x="467" y="112" textAnchor="middle" fill="#4A6080" fontSize="11" fontFamily="DM Sans">propagation</text>

          {/* Arrow 3 → 4 */}
          <line x1="545" y1="80" x2="580" y2="80" stroke="#E8A020" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Box 4 — Risk Engine */}
          <rect x="580" y="40" width="155" height="80" rx="6" fill="#0F2040" stroke="#1B6CA8" strokeWidth="1.5" />
          <text x="657" y="72" textAnchor="middle" fill="#EDF2F7" fontSize="15" fontFamily="Space Grotesk" fontWeight="700">Risk Engine</text>
          <text x="657" y="95" textAnchor="middle" fill="#7A90A8" fontSize="12" fontFamily="DM Sans">5-factor scoring</text>
          <text x="657" y="112" textAnchor="middle" fill="#4A6080" fontSize="11" fontFamily="DM Sans">0–100 scale</text>

          {/* Arrow 4 → 5 */}
          <line x1="735" y1="80" x2="770" y2="80" stroke="#E8A020" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Box 5 — Dashboard */}
          <rect x="770" y="40" width="220" height="80" rx="6" fill="#0F2040" stroke="#1B6CA8" strokeWidth="1.5" />
          <text x="880" y="72" textAnchor="middle" fill="#EDF2F7" fontSize="15" fontFamily="Space Grotesk" fontWeight="700">OIP Dashboard</text>
          <text x="880" y="95" textAnchor="middle" fill="#7A90A8" fontSize="12" fontFamily="DM Sans">Analytics, risk table,</text>
          <text x="880" y="112" textAnchor="middle" fill="#4A6080" fontSize="11" fontFamily="DM Sans">collision forecast</text>

          {/* Step labels below boxes */}
          <text x="87" y="158" textAnchor="middle" fill="#1B6CA8" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">DATA SOURCE</text>
          <text x="277" y="158" textAnchor="middle" fill="#1B6CA8" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">INGESTION</text>
          <text x="467" y="158" textAnchor="middle" fill="#E8A020" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">COMPUTATION</text>
          <text x="657" y="158" textAnchor="middle" fill="#1B6CA8" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">ANALYSIS</text>
          <text x="880" y="158" textAnchor="middle" fill="#1B6CA8" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">VISUALIZATION</text>
        </svg>
      </div>
    </div>
  );
}
