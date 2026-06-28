import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Rocket, Satellite, Activity } from "lucide-react";
import { StarField } from "@/components/StarField";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#020812] text-foreground flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Animated starfield */}
      <StarField className="z-0" />

      {/* Nebula glow layers */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[140px]" />
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
        @keyframes orbit-ring {
          from { transform: rotateZ(0deg) rotateX(75deg); }
          to   { transform: rotateZ(360deg) rotateX(75deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.3; transform: scale(1.05); }
        }
      `}</style>

      {/* Floating orbit rings */}
      <div className="absolute top-16 right-16 z-[1] pointer-events-none hidden lg:block" style={{ animation: "float 6s ease-in-out infinite" }}>
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border border-primary/20" style={{ animation: "pulse-ring 4s ease-in-out infinite" }} />
          <div className="absolute inset-4 rounded-full border border-cyan-500/15" style={{ animation: "pulse-ring 4s ease-in-out infinite 1s" }} />
          <div className="absolute inset-8 rounded-full border border-primary/25" style={{ animation: "pulse-ring 4s ease-in-out infinite 2s" }} />
          <div className="absolute inset-[46%] rounded-full bg-primary/60" />
        </div>
      </div>

      <div className="absolute bottom-24 left-16 z-[1] pointer-events-none hidden lg:block" style={{ animation: "float 8s ease-in-out infinite 2s" }}>
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border border-cyan-400/20" style={{ animation: "pulse-ring 5s ease-in-out infinite" }} />
          <div className="absolute inset-3 rounded-full border border-primary/20" style={{ animation: "pulse-ring 5s ease-in-out infinite 1.5s" }} />
          <div className="absolute inset-[45%] rounded-full bg-cyan-400/60" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary mb-4 text-sm backdrop-blur-sm">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>System Online</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
          Orbital Intelligence
          <br />
          <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
            Platform
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed">
          Real-Time Satellite Tracking and Orbital Intelligence.
          Mission-control-grade awareness for the modern space industry.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8 h-14 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
            <Link href="/dashboard">
              <Rocket className="w-5 h-5 mr-2" />
              Launch Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-14 border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
            <Link href="/satellites">
              View Catalog
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          {[
            { icon: Satellite, title: "Live Tracking", desc: "Monitor active satellites, debris, and rocket bodies with high-precision telemetry." },
            { icon: Rocket, title: "Risk Assessment", desc: "Predict close approaches and calculate collision probabilities in congested orbits." },
            { icon: Activity, title: "Congestion Analytics", desc: "Visualize orbital density and forecast future congestion trends by altitude band." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-primary/30 hover:bg-white/8 transition-all group"
            >
              <Icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2 text-white">{title}</h3>
              <p className="text-sm text-white/50">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
