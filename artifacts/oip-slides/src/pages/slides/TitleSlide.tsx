export default function TitleSlide() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D2245 60%, #091530 100%)" }}
    >
      {/* Orbital arc decoration — SVG */}
      <svg
        className="absolute top-0 right-0 opacity-10"
        style={{ width: "65vw", height: "65vw" }}
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="600" cy="0" r="260" stroke="#1B6CA8" strokeWidth="1.5" />
        <circle cx="600" cy="0" r="380" stroke="#1B6CA8" strokeWidth="1" />
        <circle cx="600" cy="0" r="500" stroke="#E8A020" strokeWidth="0.8" />
        <circle cx="600" cy="0" r="160" stroke="#E8A020" strokeWidth="2" />
        <line x1="300" y1="0" x2="600" y2="300" stroke="#1B6CA8" strokeWidth="0.6" />
        <circle cx="480" cy="140" r="6" fill="#E8A020" opacity="0.8" />
        <circle cx="350" cy="270" r="4" fill="#1B6CA8" opacity="0.9" />
        <circle cx="540" cy="50" r="3" fill="#EDF2F7" opacity="0.6" />
      </svg>

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: "0.4vw", background: "#E8A020" }}
      />

      {/* Main content — left aligned */}
      <div
        className="absolute flex flex-col justify-center"
        style={{ left: "7vw", top: "0", bottom: "0", width: "58vw" }}
      >
        {/* Category badge */}
        <div
          className="inline-flex items-center self-start"
          style={{
            background: "rgba(27, 108, 168, 0.2)",
            border: "1px solid rgba(27, 108, 168, 0.5)",
            borderRadius: "4px",
            padding: "0.6vh 1.4vw",
            marginBottom: "3vh",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "1.8vw",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "#7AB8DC",
            }}
          >
            SPACE TECHNOLOGY&nbsp;&nbsp;•&nbsp;&nbsp;SOFTWARE
          </span>
        </div>

        {/* Hero headline */}
        <h1
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "6.5vw",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#EDF2F7",
            textWrap: "balance",
            marginBottom: "2.5vh",
          }}
        >
          Orbital Intelligence
          <span style={{ display: "block", color: "#E8A020" }}>Platform</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "2.6vw",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "#7A90A8",
            textWrap: "pretty",
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
          borderTop: "1px solid rgba(27, 108, 168, 0.3)",
          background: "rgba(15, 32, 64, 0.7)",
          paddingLeft: "7vw",
          paddingRight: "7vw",
          gap: "0",
        }}
      >
        <div className="flex items-center" style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "3.2vw",
              fontWeight: 700,
              color: "#E8A020",
            }}
          >
            27,000+
          </span>
          <span
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2vw",
              color: "#7A90A8",
              marginLeft: "1vw",
            }}
          >
            Objects Tracked
          </span>
        </div>
        <div
          style={{ width: "1px", height: "5vh", background: "rgba(122, 144, 168, 0.3)" }}
        />
        <div className="flex items-center" style={{ flex: 1, paddingLeft: "3vw" }}>
          <span
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.4vw",
              fontWeight: 700,
              color: "#E8A020",
            }}
          >
            Live TLE Data
          </span>
          <span
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2vw",
              color: "#7A90A8",
              marginLeft: "1vw",
            }}
          >
            via CelesTrak API
          </span>
        </div>
        <div
          style={{ width: "1px", height: "5vh", background: "rgba(122, 144, 168, 0.3)" }}
        />
        <div className="flex items-center" style={{ flex: 1, paddingLeft: "3vw" }}>
          <span
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.4vw",
              fontWeight: 700,
              color: "#E8A020",
            }}
          >
            SGP4
          </span>
          <span
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2vw",
              color: "#7A90A8",
              marginLeft: "1vw",
            }}
          >
            Propagation Engine
          </span>
        </div>
      </div>
    </div>
  );
}
