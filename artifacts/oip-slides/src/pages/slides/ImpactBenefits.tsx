export default function ImpactBenefits() {
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
          05 / 05
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
          Impact &amp; Benefits
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
          Who Benefits &amp; How
        </h2>
      </div>

      {/* Two-column body */}
      <div
        className="absolute flex"
        style={{ top: "26vh", left: "7vw", right: "5vw", bottom: "6vh", gap: "4vw" }}
      >
        {/* Left — Target Audience + Impact */}
        <div className="flex flex-col" style={{ width: "44%", gap: "2vh" }}>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.2vw",
              fontWeight: 600,
              color: "#7AB8DC",
            }}
          >
            Impact on Target Audience
          </div>

          <div className="flex flex-col" style={{ gap: "1.6vh" }}>
            {/* Positive 1 */}
            <div
              style={{
                background: "rgba(168, 232, 176, 0.07)",
                border: "1px solid rgba(168, 232, 176, 0.2)",
                borderRadius: "6px",
                padding: "1.6vh 1.5vw",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "1.8vw",
                  fontWeight: 600,
                  color: "#A8E8B0",
                  marginBottom: "0.5vh",
                }}
              >
                Improvement
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "2vw",
                  color: "#CBD5E0",
                  lineHeight: 1.4,
                }}
              >
                Satellite operators get advance warning of conjunction events, enabling earlier avoidance maneuvers
              </p>
            </div>

            {/* Positive 2 */}
            <div
              style={{
                background: "rgba(168, 232, 176, 0.07)",
                border: "1px solid rgba(168, 232, 176, 0.2)",
                borderRadius: "6px",
                padding: "1.6vh 1.5vw",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "1.8vw",
                  fontWeight: 600,
                  color: "#A8E8B0",
                  marginBottom: "0.5vh",
                }}
              >
                New Opportunities
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "2vw",
                  color: "#CBD5E0",
                  lineHeight: 1.4,
                }}
              >
                Researchers gain open access to structured orbital analytics, debris trends, and congestion history
              </p>
            </div>

            {/* Negative */}
            <div
              style={{
                background: "rgba(232, 170, 170, 0.07)",
                border: "1px solid rgba(232, 170, 170, 0.2)",
                borderRadius: "6px",
                padding: "1.6vh 1.5vw",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "1.8vw",
                  fontWeight: 600,
                  color: "#E8AAAA",
                  marginBottom: "0.5vh",
                }}
              >
                Consideration
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "2vw",
                  color: "#CBD5E0",
                  lineHeight: 1.4,
                }}
              >
                Technology adoption requires integration with existing ground station workflows; initial transition cost applies
              </p>
            </div>
          </div>
        </div>

        {/* Right — Benefit categories */}
        <div className="flex flex-col" style={{ width: "52%", gap: "2vh" }}>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.2vw",
              fontWeight: 600,
              color: "#7AB8DC",
            }}
          >
            Benefits of the Solution
          </div>

          {/* Social */}
          <div
            style={{
              background: "rgba(15, 32, 64, 0.8)",
              border: "1px solid rgba(27, 108, 168, 0.35)",
              borderRadius: "8px",
              padding: "1.8vh 2vw",
            }}
          >
            <div className="flex items-center" style={{ marginBottom: "1vh", gap: "1vw" }}>
              <div
                style={{
                  width: "0.5vw",
                  height: "3.5vh",
                  background: "#1B6CA8",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2.2vw",
                  fontWeight: 700,
                  color: "#EDF2F7",
                }}
              >
                Social
              </span>
            </div>
            <div className="flex" style={{ gap: "2vw" }}>
              <span
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.9vw",
                  color: "#7A90A8",
                }}
              >
                Improved access to orbital data
              </span>
              <span style={{ color: "#4A6080", fontSize: "1.9vw" }}>•</span>
              <span
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.9vw",
                  color: "#7A90A8",
                }}
              >
                Space safety democratized
              </span>
            </div>
          </div>

          {/* Economic */}
          <div
            style={{
              background: "rgba(15, 32, 64, 0.8)",
              border: "1px solid rgba(27, 108, 168, 0.35)",
              borderRadius: "8px",
              padding: "1.8vh 2vw",
            }}
          >
            <div className="flex items-center" style={{ marginBottom: "1vh", gap: "1vw" }}>
              <div
                style={{
                  width: "0.5vw",
                  height: "3.5vh",
                  background: "#E8A020",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2.2vw",
                  fontWeight: 700,
                  color: "#EDF2F7",
                }}
              >
                Economic
              </span>
            </div>
            <div className="flex" style={{ gap: "2vw" }}>
              <span
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.9vw",
                  color: "#7A90A8",
                }}
              >
                Reduced satellite loss risk
              </span>
              <span style={{ color: "#4A6080", fontSize: "1.9vw" }}>•</span>
              <span
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.9vw",
                  color: "#7A90A8",
                }}
              >
                Lower monitoring cost vs. proprietary tools
              </span>
            </div>
          </div>

          {/* Environmental */}
          <div
            style={{
              background: "rgba(15, 32, 64, 0.8)",
              border: "1px solid rgba(27, 108, 168, 0.35)",
              borderRadius: "8px",
              padding: "1.8vh 2vw",
            }}
          >
            <div className="flex items-center" style={{ marginBottom: "1vh", gap: "1vw" }}>
              <div
                style={{
                  width: "0.5vw",
                  height: "3.5vh",
                  background: "#A8E8B0",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2.2vw",
                  fontWeight: 700,
                  color: "#EDF2F7",
                }}
              >
                Environmental
              </span>
            </div>
            <div className="flex" style={{ gap: "2vw" }}>
              <span
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.9vw",
                  color: "#7A90A8",
                }}
              >
                Supports debris mitigation decisions
              </span>
              <span style={{ color: "#4A6080", fontSize: "1.9vw" }}>•</span>
              <span
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "1.9vw",
                  color: "#7A90A8",
                }}
              >
                Promotes sustainable orbit use
              </span>
            </div>
          </div>

          {/* Target audience */}
          <div
            style={{
              background: "rgba(232, 160, 32, 0.07)",
              border: "1px solid rgba(232, 160, 32, 0.25)",
              borderRadius: "8px",
              padding: "1.6vh 2vw",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display-family)",
                fontSize: "1.7vw",
                fontWeight: 600,
                color: "#E8A020",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.8vh",
              }}
            >
              Target Audience
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "2vw",
                color: "#CBD5E0",
                lineHeight: 1.5,
              }}
            >
              Satellite operators&nbsp;&nbsp;•&nbsp;&nbsp;Space agencies&nbsp;&nbsp;•&nbsp;&nbsp;Research institutions&nbsp;&nbsp;•&nbsp;&nbsp;Debris mitigation bodies
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
