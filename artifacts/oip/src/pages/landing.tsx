import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Rocket, Satellite, Activity, Globe } from "lucide-react";
import { StarField } from "@/components/StarField";

export default function Landing() {
  return (
    <div className="min-h-[100dvh] bg-[#020812] text-foreground flex flex-col items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Animated starfield */}
      <StarField className="z-0" />

      {/* Nebula glow layers */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-blue-600/5 blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-cyan-500/5 blur-[90px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[800px] h-[200px] sm:h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Scanning line animation */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          style={{ animation: "scanline 8s linear infinite" }}
        />
      </div>

      <style>{`
        @keyframes scanline {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.3; transform: scale(1.05); }
        }
      `}</style>

      {/* Floating orbit rings for large screens */}
      <div className="absolute top-16 right-16 z-[1] pointer-events-none hidden xl:block" style={{ animation: "float 6s ease-in-out infinite" }}>
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border border-primary/20" style={{ animation: "pulse-ring 4s ease-in-out infinite" }} />
          <div className="absolute inset-4 rounded-full border border-cyan-500/15" style={{ animation: "pulse-ring 4s ease-in-out infinite 1s" }} />
          <div className="absolute inset-8 rounded-full border border-primary/25" style={{ animation: "pulse-ring 4s ease-in-out infinite 2s" }} />
          <div className="absolute inset-[46%] rounded-full bg-primary/60" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary mb-2 text-xs sm:text-sm backdrop-blur-sm">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>System Online</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent leading-[1.1]">
          Orbital Intelligence
          <br />
          <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
            Platform
          </span>
        </h1>

        <p className="text-sm xs:text-base sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed px-2">
          Real-Time Satellite Tracking and Space Situational Awareness.
          Mission-control-grade awareness for the modern space era.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 sm:pt-6 w-full max-w-md mx-auto sm:max-w-none">
          <Button asChild size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 h-12 sm:h-14 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
            <Link href="/dashboard">
              <Rocket className="w-5 h-5 mr-2" />
              Launch Mission Control
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-8 h-12 sm:h-14 border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40">
            <Link href="/live-orbital-view">
              <Globe className="w-5 h-5 mr-2 text-cyan-400" />
              Live 3D Earth
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-10 sm:pt-16 text-left">
          {[
            { icon: Satellite, title: "Live Tracking", desc: "Monitor active satellites, debris, and rocket bodies with analytical SGP4 propagation." },
            { icon: Rocket, title: "Risk Assessment", desc: "Predict close approaches and calculate conjunction probability in congested orbits." },
            { icon: Activity, title: "Congestion Analytics", desc: "Visualize orbital density and forecast future congestion trends by altitude band." },
          ].map((feature, i) => (
            <div key={i} className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary/40 transition-colors">
              <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary mb-3" />
              <h2 className="text-base sm:text-lg font-semibold text-white mb-1.5">{feature.title}</h2>
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
