import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database, Activity, Cpu } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto py-4 sm:py-8 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 sm:mb-4">About OIP</h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          The Orbital Intelligence Platform is a comprehensive mission control interface for tracking 
          artificial satellites, orbital debris, and assessing collision risks in Earth's orbit.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Database className="w-5 h-5 text-primary" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>
              OIP ingests real-time Two-Line Element (TLE) sets primarily from <strong>CelesTrak</strong>, 
              providing high-fidelity orbital data for active satellites, rocket bodies, and debris.
            </p>
            <p>
              Data is periodically refreshed via an automated internal scheduler to ensure risk models and
              positional propagation remain accurate.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="w-5 h-5 text-primary" />
              Risk Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>
              The proprietary Risk Engine evaluates multiple orbital parameters to assign a threat score (0-100) 
              to space assets.
            </p>
            <p>
              Factors include local orbit congestion, historical close approach frequency, 
              object maneuverability (active vs debris), and calculated collision probability.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="w-5 h-5 text-primary" />
              Orbital Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>
              OIP provides macro-level analysis of orbital density, mapping congestion across 
              altitude bands and inclination regimes.
            </p>
            <p>
              Predictive models forecast future congestion trends over 30-day to 1-year horizons 
              to assist in long-term mission planning and launch window selection.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Cpu className="w-5 h-5 text-primary" />
              Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>
              Engineered with a high-performance modern web stack featuring React, CesiumJS 3D Earth,
              SGP4 propagation, Tailwind CSS, Express backend, and Neon PostgreSQL database.
            </p>
            <p>
              Built to meet national-level space situational awareness demonstration standards with zero mock coordinates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
