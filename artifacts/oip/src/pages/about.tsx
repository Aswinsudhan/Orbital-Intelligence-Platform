import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database, Activity, Cpu } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">About OIP</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          The Orbital Intelligence Platform is a comprehensive mission control interface for tracking 
          artificial satellites, orbital debris, and assessing collision risks in Earth's orbit.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              OIP ingests real-time Two-Line Element (TLE) sets primarily from <strong>CelesTrak</strong>, 
              providing high-fidelity orbital data for active satellites and debris.
            </p>
            <p>
              Data is periodically refreshed via an internal scheduler to ensure risk models and
              positional data remain accurate.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Risk Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              The proprietary Risk Engine evaluates multiple factors to assign a threat score (0-100) 
              to orbital objects.
            </p>
            <p>
              Factors include: local orbit congestion, historical close approach frequency, 
              object maneuverability (active vs debris), and calculated collision probability.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              OIP provides macro-level analysis of orbital density, mapping congestion across 
              altitude bands and inclinations.
            </p>
            <p>
              Predictive models forecast future congestion trends over 30-day to 1-year horizons 
              to assist in long-term mission planning and launch window selection.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              Built for performance: React/Vite frontend with a specialized API client communicating 
              with a robust backend data ingestion pipeline.
            </p>
            <p>
              The interface utilizes a custom deep-space design system optimized for high data 
              density and prolonged monitoring sessions.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-sm text-muted-foreground/60 pt-12 border-t border-border/50">
        Orbital Intelligence Platform v1.0.0 &bull; Mission Control Interface
      </div>
    </div>
  );
}