export default function ProblemStatement() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#EEF2F8" }}
    >
      <div className="absolute left-0 top-0 bottom-0" style={{ width: "0.35vw", background: "#9B6824" }} />

      {/* Slide number badge */}
      <div
        className="absolute flex items-center justify-center"
        style={{ top: "2.5vh", right: "4vw", background: "rgba(155, 104, 36, 0.08)", border: "1px solid rgba(155, 104, 36, 0.25)", borderRadius: "4px", padding: "0.3vh 1vw" }}
      >
        <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.4vw", fontWeight: 600, color: "#9B6824" }}>
          01 / 05
        </span>
      </div>

      {/* Left column */}
      <div className="absolute flex flex-col" style={{ left: "6vw", top: "4vh", bottom: "4vh", width: "50vw" }}>
        <div
          style={{ fontFamily: "var(--font-display-family)", fontSize: "1.2vw", fontWeight: 600, letterSpacing: "0.06em", color: "#2E5D9B", marginBottom: "0.8vh", textTransform: "uppercase" }}
        >
          Problem Statement
        </div>

        <div
          style={{ display: "inline-block", background: "rgba(46, 93, 155, 0.07)", border: "1px solid rgba(46, 93, 155, 0.2)", borderRadius: "4px", padding: "0.3vh 1vw", marginBottom: "1.4vh", alignSelf: "flex-start" }}
        >
          <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", fontWeight: 500, color: "#2E5D9B" }}>
            Category: Software&nbsp;&nbsp;|&nbsp;&nbsp;Space Technology
          </span>
        </div>

        <h2
          style={{ fontFamily: "var(--font-display-family)", fontSize: "3.6vw", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em", color: "#1B2B44", marginBottom: "1.2vh" }}
        >
          The Space Debris Crisis
        </h2>

        <p
          style={{ fontFamily: "var(--font-body-family)", fontSize: "1.8vw", fontWeight: 400, lineHeight: 1.25, color: "#586878", marginBottom: "2vh" }}
        >
          Orbital congestion is accelerating. Operators lack a unified,
          real-time tool to monitor risk and predict conjunction events.
        </p>

        <div className="flex flex-col" style={{ gap: "1.2vh" }}>
          {/* Problem 1 */}
          <div className="flex items-start" style={{ gap: "1vw" }}>
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: "2.6vw", height: "2.6vw", background: "rgba(155, 104, 36, 0.1)", border: "1px solid rgba(155, 104, 36, 0.3)", borderRadius: "4px" }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.4vw", fontWeight: 700, color: "#9B6824" }}>01</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.9vw", fontWeight: 600, color: "#1B2B44", marginBottom: "0.2vh" }}>Orbital Congestion</div>
              <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#586878", lineHeight: 1.25 }}>
                LEO tracked objects have tripled since 2019 — approaching unsustainable density
              </div>
            </div>
          </div>

          {/* Problem 2 */}
          <div className="flex items-start" style={{ gap: "1vw" }}>
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: "2.6vw", height: "2.6vw", background: "rgba(155, 104, 36, 0.1)", border: "1px solid rgba(155, 104, 36, 0.3)", borderRadius: "4px" }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.4vw", fontWeight: 700, color: "#9B6824" }}>02</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.9vw", fontWeight: 600, color: "#1B2B44", marginBottom: "0.2vh" }}>Fragmented Tools</div>
              <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#586878", lineHeight: 1.25 }}>
                TLE feeds, risk scores, and debris catalogs exist in isolated, disconnected systems
              </div>
            </div>
          </div>

          {/* Problem 3 */}
          <div className="flex items-start" style={{ gap: "1vw" }}>
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: "2.6vw", height: "2.6vw", background: "rgba(155, 104, 36, 0.1)", border: "1px solid rgba(155, 104, 36, 0.3)", borderRadius: "4px" }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontSize: "1.4vw", fontWeight: 700, color: "#9B6824" }}>03</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display-family)", fontSize: "1.9vw", fontWeight: 600, color: "#1B2B44", marginBottom: "0.2vh" }}>Reactive, Not Predictive</div>
              <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#586878", lineHeight: 1.25 }}>
                No integrated platform predicts collision risk before conjunction events occur
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right column — stat cards */}
      <div
        className="absolute flex flex-col justify-center"
        style={{ right: "4vw", top: "4vh", bottom: "4vh", width: "31vw", gap: "1.5vh" }}
      >
        <div style={{ background: "#FFFFFF", border: "1px solid rgba(46, 93, 155, 0.2)", borderRadius: "8px", padding: "1.8vh 1.8vw", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "3.5vw", fontWeight: 700, color: "#9B6824", lineHeight: 1, marginBottom: "0.5vh" }}>27,000+</div>
          <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#1B2B44", marginBottom: "0.3vh" }}>Tracked objects in Earth orbit</div>
          <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.3vw", color: "#9AAABB" }}>Source: ESA Space Debris Office</div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid rgba(46, 93, 155, 0.2)", borderRadius: "8px", padding: "1.8vh 1.8vw", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "3.5vw", fontWeight: 700, color: "#9B6824", lineHeight: 1, marginBottom: "0.5vh" }}>100M+</div>
          <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#1B2B44", marginBottom: "0.3vh" }}>Untracked debris fragments below 10 cm</div>
          <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.3vw", color: "#9AAABB" }}>Source: NASA Orbital Debris Program</div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid rgba(46, 93, 155, 0.2)", borderRadius: "8px", padding: "1.8vh 1.8vw", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontFamily: "var(--font-display-family)", fontSize: "3.5vw", fontWeight: 700, color: "#9B6824", lineHeight: 1, marginBottom: "0.5vh" }}>9,000+</div>
          <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#1B2B44", marginBottom: "0.3vh" }}>Active and inactive satellites in orbit</div>
          <div style={{ fontFamily: "var(--font-body-family)", fontSize: "1.3vw", color: "#9AAABB" }}>Source: UCS Satellite Database, 2024</div>
        </div>
      </div>
    </div>
  );
}
