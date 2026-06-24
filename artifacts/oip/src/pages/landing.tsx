import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Rocket, Satellite, Activity } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4 text-sm">
          <Activity className="w-4 h-4" />
          <span>System Online</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          Orbital Intelligence Platform
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Real-Time Satellite Tracking and Orbital Intelligence. Mission-control-grade awareness for the modern space industry.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8 h-14">
            <Link href="/dashboard">
              Launch Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-14">
            <Link href="/satellites">
              View Catalog
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-6 rounded-xl bg-card border border-border">
            <Satellite className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Live Tracking</h3>
            <p className="text-sm text-muted-foreground">Monitor active satellites, debris, and rocket bodies with high-precision telemetry.</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Rocket className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">Predict close approaches and calculate collision probabilities in congested orbits.</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <Activity className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Congestion Analytics</h3>
            <p className="text-sm text-muted-foreground">Visualize orbital density and forecast future congestion trends by altitude band.</p>
          </div>
        </div>
      </div>
    </div>
  );
}