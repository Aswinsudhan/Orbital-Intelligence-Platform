export default function IdeaAndSolution() {
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
          02 / 05
        </span>
      </div>

      {/* Header row */}
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
          Idea &amp; Proposed Solution
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "4.5vw",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#EDF2F7",
            marginBottom: "0",
          }}
        >
          One Platform. Complete Orbital Picture.
        </h2>
      </div>

      {/* Two-column body */}
      <div
        className="absolute flex"
        style={{ top: "26vh", left: "7vw", right: "5vw", bottom: "6vh", gap: "5vw" }}
      >
        {/* Left column — What it is + UVPs */}
        <div className="flex flex-col" style={{ width: "46%", gap: "2.5vh" }}>
          {/* Solution summary */}
          <div
            style={{
              background: "rgba(27, 108, 168, 0.1)",
              border: "1px solid rgba(27, 108, 168, 0.35)",
              borderRadius: "8px",
              padding: "2.5vh 2vw",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "2.2vw",
                fontWeight: 600,
                color: "#7AB8DC",
                marginBottom: "1vh",
              }}
            >
              Proposed Solution
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2.3vw",
                lineHeight: 1.5,
                color: "#CBD5E0",
              }}
            >
              OIP is a web-based orbital intelligence platform that consolidates
              satellite tracking, debris monitoring, multi-factor risk scoring,
              and collision prediction into a single, operator-facing interface.
            </p>
          </div>

          {/* Unique Value Propositions */}
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2vw",
              fontWeight: 600,
              color: "#E8A020",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Unique Value Propositions
          </div>

          <div className="flex flex-col" style={{ gap: "1.5vh" }}>
            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div
                style={{
                  width: "0.5vw",
                  height: "4vh",
                  background: "#E8A020",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "2.2vw",
                    fontWeight: 600,
                    color: "#EDF2F7",
                  }}
                >
                  Unified Dashboard
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "2vw",
                    color: "#7A90A8",
                  }}
                >
                  Satellites, debris, and risk in one view
                </div>
              </div>
            </div>

            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div
                style={{
                  width: "0.5vw",
                  height: "4vh",
                  background: "#E8A020",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "2.2vw",
                    fontWeight: 600,
                    color: "#EDF2F7",
                  }}
                >
                  On-Demand Sync
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "2vw",
                    color: "#7A90A8",
                  }}
                >
                  Manual or scheduled live TLE refresh
                </div>
              </div>
            </div>

            <div className="flex items-center" style={{ gap: "1.2vw" }}>
              <div
                style={{
                  width: "0.5vw",
                  height: "4vh",
                  background: "#E8A020",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: "2.2vw",
                    fontWeight: 600,
                    color: "#EDF2F7",
                  }}
                >
                  Predictive Risk Engine
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body-family)",
                    fontSize: "2vw",
                    color: "#7A90A8",
                  }}
                >
                  5-factor scoring: proximity, congestion, age, eccentricity, frequency
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — How implemented + Problem Resolution */}
        <div className="flex flex-col" style={{ width: "49%", gap: "2.5vh" }}>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.2vw",
              fontWeight: 600,
              color: "#7AB8DC",
            }}
          >
            How It Is Implemented
          </div>

          <div className="flex flex-col" style={{ gap: "1.8vh" }}>
            <div
              className="flex items-start"
              style={{ gap: "1.2vw" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2vw",
                  fontWeight: 700,
                  color: "#1B6CA8",
                  flexShrink: 0,
                  marginTop: "0.2vh",
                }}
              >
                01
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "2.2vw",
                  color: "#CBD5E0",
                  lineHeight: 1.4,
                }}
              >
                CelesTrak API fetches live Two-Line Element sets for all tracked objects
              </span>
            </div>

            <div
              className="flex items-start"
              style={{ gap: "1.2vw" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2vw",
                  fontWeight: 700,
                  color: "#1B6CA8",
                  flexShrink: 0,
                  marginTop: "0.2vh",
                }}
              >
                02
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "2.2vw",
                  color: "#CBD5E0",
                  lineHeight: 1.4,
                }}
              >
                SGP4 propagation computes real-time orbital positions, altitude, and velocity
              </span>
            </div>

            <div
              className="flex items-start"
              style={{ gap: "1.2vw" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2vw",
                  fontWeight: 700,
                  color: "#1B6CA8",
                  flexShrink: 0,
                  marginTop: "0.2vh",
                }}
              >
                03
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "2.2vw",
                  color: "#CBD5E0",
                  lineHeight: 1.4,
                }}
              >
                Risk engine computes 0–100 scores across Low, Medium, High, and Critical categories
              </span>
            </div>

            <div
              className="flex items-start"
              style={{ gap: "1.2vw" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2vw",
                  fontWeight: 700,
                  color: "#1B6CA8",
                  flexShrink: 0,
                  marginTop: "0.2vh",
                }}
              >
                04
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "2.2vw",
                  color: "#CBD5E0",
                  lineHeight: 1.4,
                }}
              >
                Collision prediction identifies closest-approach pairs and time-to-event windows
              </span>
            </div>
          </div>

          {/* Problem Resolution note */}
          <div
            style={{
              background: "rgba(232, 160, 32, 0.08)",
              border: "1px solid rgba(232, 160, 32, 0.3)",
              borderRadius: "8px",
              padding: "2vh 1.8vw",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.9vw",
                fontWeight: 600,
                color: "#E8A020",
                marginBottom: "0.8vh",
              }}
            >
              Problem Resolution
            </div>
            <p
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#7A90A8",
                lineHeight: 1.4,
              }}
            >
              OIP replaces fragmented, reactive workflows with a single
              real-time interface — shifting orbital safety from incident
              response to continuous, data-driven monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
