export default function TitleSlide() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #E8EFF8 0%, #EEF2F8 50%, #E4EBF5 100%)" }}
    >
      {/* Subtle orbital arc decoration */}
      <svg
        className="absolute top-0 right-0"
        style={{ width: "55vw", height: "55vw", opacity: 0.07 }}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="500" cy="0" r="220" stroke="#2E5D9B" strokeWidth="1.5" />
        <circle cx="500" cy="0" r="330" stroke="#2E5D9B" strokeWidth="1" />
        <circle cx="500" cy="0" r="430" stroke="#9B6824" strokeWidth="0.8" />
        <circle cx="500" cy="0" r="140" stroke="#9B6824" strokeWidth="2" />
        <circle cx="410" cy="110" r="5" fill="#9B6824" />
        <circle cx="300" cy="240" r="3.5" fill="#2E5D9B" />
      </svg>

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: "0.35vw", background: "#9B6824" }}
      />

      {/* Main content */}
      <div
        className="absolute flex flex-col justify-center"
        style={{ left: "6vw", top: "0", bottom: "0", width: "60vw" }}
      >
        {/* Category badge */}
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            background: "rgba(46, 93, 155, 0.08)",
            border: "1px solid rgba(46, 93, 155, 0.25)",
            borderRadius: "4px",
            padding: "0.4vh 1.1vw",
            marginBottom: "2vh",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "1.4vw",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "#2E5D9B",
            }}
          >
            SPACE TECHNOLOGY&nbsp;&nbsp;•&nbsp;&nbsp;SOFTWARE
          </span>
        </div>

        {/* Hero headline */}
        <h1
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "5.2vw",
            fontWeight: 700,
            lineHeight: 1.07,
            letterSpacing: "-0.02em",
            color: "#1B2B44",
            marginBottom: "1.8vh",
          }}
        >
          Orbital Intelligence
          <span style={{ display: "block", color: "#9B6824" }}>Platform</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "2.1vw",
            fontWeight: 400,
            lineHeight: 1.3,
            color: "#586878",
            marginBottom: "0",
          }}
        >
          Real-time satellite tracking, orbital risk assessment,
          and collision analysis for Earth-orbiting objects.
        </p>
      </div>

      {/* Bottom stat bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center"
        style={{
          height: "12vh",
          borderTop: "1px solid rgba(46, 93, 155, 0.18)",
          background: "rgba(46, 93, 155, 0.04)",
          paddingLeft: "6vw",
          paddingRight: "6vw",
        }}
      >
        <div className="flex items-center" style={{ flex: 1 }}>
          <span style={{ fontFamily: "var(--font-display-family)", fontSize: "2.6vw", fontWeight: 700, color: "#9B6824" }}>
            27,000+
          </span>
          <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878", marginLeft: "0.7vw" }}>
            Objects Tracked
          </span>
        </div>
        <div style={{ width: "1px", height: "4vh", background: "rgba(88, 104, 120, 0.25)" }} />
        <div className="flex items-center" style={{ flex: 1, paddingLeft: "2.5vw" }}>
          <span style={{ fontFamily: "var(--font-display-family)", fontSize: "2.1vw", fontWeight: 700, color: "#9B6824" }}>
            Live TLE Data
          </span>
          <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878", marginLeft: "0.7vw" }}>
            via CelesTrak API
          </span>
        </div>
        <div style={{ width: "1px", height: "4vh", background: "rgba(88, 104, 120, 0.25)" }} />
        <div className="flex items-center" style={{ flex: 1, paddingLeft: "2.5vw" }}>
          <span style={{ fontFamily: "var(--font-display-family)", fontSize: "2.1vw", fontWeight: 700, color: "#9B6824" }}>
            SGP4
          </span>
          <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#586878", marginLeft: "0.7vw" }}>
            Propagation Engine
          </span>
        </div>
      </div>
    </div>
  );
}
