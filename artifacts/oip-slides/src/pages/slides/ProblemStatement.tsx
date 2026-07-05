export default function ProblemStatement() {
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

      {/* Slide number badge — top right */}
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
          01 / 05
        </span>
      </div>

      {/* Left column */}
      <div
        className="absolute flex flex-col justify-start"
        style={{ left: "7vw", top: "6vh", bottom: "6vh", width: "50vw" }}
      >
        {/* Section label */}
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "1.6vw",
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: "#1B6CA8",
            marginBottom: "1.5vh",
            textTransform: "uppercase",
          }}
        >
          Problem Statement
        </div>

        {/* Category badge */}
        <div
          style={{
            display: "inline-block",
            background: "rgba(27, 108, 168, 0.15)",
            border: "1px solid rgba(27, 108, 168, 0.4)",
            borderRadius: "4px",
            padding: "0.5vh 1.2vw",
            marginBottom: "2.5vh",
            alignSelf: "flex-start",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.8vw",
              fontWeight: 500,
              color: "#7AB8DC",
            }}
          >
            Category: Software&nbsp;&nbsp;|&nbsp;&nbsp;Space Technology
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "4.8vw",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#EDF2F7",
            marginBottom: "2vh",
            textWrap: "balance",
          }}
        >
          The Space Debris Crisis
        </h2>

        {/* Brief description */}
        <p
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "2.4vw",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "#7A90A8",
            marginBottom: "3.5vh",
            textWrap: "pretty",
          }}
        >
          Orbital congestion is accelerating. Operators lack a unified,
          real-time tool to monitor risk, track debris, and predict conjunction events.
        </p>

        {/* Problem bullets */}
        <div className="flex flex-col" style={{ gap: "1.8vh" }}>
          {/* Problem 1 */}
          <div
            className="flex items-start"
            style={{ gap: "1.5vw" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "3.2vw",
                height: "3.2vw",
                background: "rgba(232, 160, 32, 0.15)",
                border: "1px solid rgba(232, 160, 32, 0.4)",
                borderRadius: "4px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "1.8vw",
                  fontWeight: 700,
                  color: "#E8A020",
                }}
              >
                01
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2.4vw",
                  fontWeight: 600,
                  color: "#EDF2F7",
                  marginBottom: "0.4vh",
                }}
              >
                Orbital Congestion
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "2.1vw",
                  color: "#7A90A8",
                  lineHeight: 1.4,
                }}
              >
                LEO is nearing unsustainable density — tracked objects have tripled since 2019
              </div>
            </div>
          </div>

          {/* Problem 2 */}
          <div
            className="flex items-start"
            style={{ gap: "1.5vw" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "3.2vw",
                height: "3.2vw",
                background: "rgba(232, 160, 32, 0.15)",
                border: "1px solid rgba(232, 160, 32, 0.4)",
                borderRadius: "4px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "1.8vw",
                  fontWeight: 700,
                  color: "#E8A020",
                }}
              >
                02
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2.4vw",
                  fontWeight: 600,
                  color: "#EDF2F7",
                  marginBottom: "0.4vh",
                }}
              >
                Fragmented Tools
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "2.1vw",
                  color: "#7A90A8",
                  lineHeight: 1.4,
                }}
              >
                TLE feeds, risk scores, and debris catalogs exist in isolated, disconnected systems
              </div>
            </div>
          </div>

          {/* Problem 3 */}
          <div
            className="flex items-start"
            style={{ gap: "1.5vw" }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "3.2vw",
                height: "3.2vw",
                background: "rgba(232, 160, 32, 0.15)",
                border: "1px solid rgba(232, 160, 32, 0.4)",
                borderRadius: "4px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "1.8vw",
                  fontWeight: 700,
                  color: "#E8A020",
                }}
              >
                03
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: "2.4vw",
                  fontWeight: 600,
                  color: "#EDF2F7",
                  marginBottom: "0.4vh",
                }}
              >
                Reactive, Not Predictive
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body-family)",
                  fontSize: "2.1vw",
                  color: "#7A90A8",
                  lineHeight: 1.4,
                }}
              >
                No integrated platform predicts collision risk before conjunction events occur
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right column — stat cards */}
      <div
        className="absolute flex flex-col justify-center"
        style={{ right: "5vw", top: "6vh", bottom: "6vh", width: "31vw", gap: "2.5vh" }}
      >
        {/* Stat card 1 */}
        <div
          style={{
            background: "rgba(15, 32, 64, 0.9)",
            border: "1px solid rgba(27, 108, 168, 0.4)",
            borderRadius: "8px",
            padding: "3vh 2.5vw",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "4.5vw",
              fontWeight: 700,
              color: "#E8A020",
              lineHeight: 1,
              marginBottom: "0.8vh",
            }}
          >
            27,000+
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2.1vw",
              color: "#7A90A8",
            }}
          >
            Tracked objects in Earth orbit
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.8vw",
              color: "#4A6080",
              marginTop: "0.5vh",
            }}
          >
            Source: ESA Space Debris Office
          </div>
        </div>

        {/* Stat card 2 */}
        <div
          style={{
            background: "rgba(15, 32, 64, 0.9)",
            border: "1px solid rgba(27, 108, 168, 0.4)",
            borderRadius: "8px",
            padding: "3vh 2.5vw",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "4.5vw",
              fontWeight: 700,
              color: "#E8A020",
              lineHeight: 1,
              marginBottom: "0.8vh",
            }}
          >
            100M+
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2.1vw",
              color: "#7A90A8",
            }}
          >
            Untracked debris fragments below 10 cm
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.8vw",
              color: "#4A6080",
              marginTop: "0.5vh",
            }}
          >
            Source: NASA Orbital Debris Program
          </div>
        </div>

        {/* Stat card 3 */}
        <div
          style={{
            background: "rgba(15, 32, 64, 0.9)",
            border: "1px solid rgba(27, 108, 168, 0.4)",
            borderRadius: "8px",
            padding: "3vh 2.5vw",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "4.5vw",
              fontWeight: 700,
              color: "#E8A020",
              lineHeight: 1,
              marginBottom: "0.8vh",
            }}
          >
            9,000+
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2.1vw",
              color: "#7A90A8",
            }}
          >
            Active and inactive satellites currently in orbit
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.8vw",
              color: "#4A6080",
              marginTop: "0.5vh",
            }}
          >
            Source: UCS Satellite Database, 2024
          </div>
        </div>
      </div>
    </div>
  );
}
