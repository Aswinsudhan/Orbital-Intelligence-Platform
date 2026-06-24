# Orbital Intelligence Platform (OIP)

Real-time satellite tracking and orbital intelligence platform. Mission-control-grade awareness for the modern space industry.

![OIP Dashboard](https://img.shields.io/badge/status-live-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Node](https://img.shields.io/badge/node-24-green) ![TypeScript](https://img.shields.io/badge/typescript-5.9-blue)

## Features

- **Live Satellite Tracking** — 927+ real satellites fetched from live TLE data via the TLE API
- **Debris Monitoring** — 1,200+ debris objects and rocket bodies tracked by orbital band
- **Risk Engine** — 0–100 multi-factor risk scoring for every tracked object
- **Collision Analysis** — Real-time close-approach detection and warning system
- **Analytics & Charts** — Orbit distribution, congestion heatmaps, altitude histograms
- **Orbital Forecast** — Altitude decay and re-entry projections
- **3D Visualization** — Interactive orbital globe
- **Admin Panel** — Manual data refresh, system health monitoring

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Tailwind CSS v4, Recharts |
| Backend | Node.js 24, Express 5, TypeScript 5.9 |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod v4 |
| API Contract | OpenAPI 3.1 + Orval codegen |
| Package Manager | pnpm workspaces |
| Data Source | [TLE API](https://tle.ivanstanojevic.me) (live orbital data) |

## Project Structure

```
├── artifacts/
│   ├── oip/              # React + Vite frontend
│   └── api-server/       # Express API server
├── lib/
│   ├── api-spec/         # OpenAPI spec + codegen output
│   └── db/               # Drizzle ORM schema & migrations
├── scripts/              # Utility scripts
└── pnpm-workspace.yaml   # Workspace config
```

## Getting Started

### Prerequisites
- Node.js 24+
- pnpm 9+
- PostgreSQL database

### Setup

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm --filter @workspace/db run push

# Start API server (port 5000)
pnpm --filter @workspace/api-server run dev

# Start frontend (separate terminal)
pnpm --filter @workspace/oip run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret for session signing |
| `PORT` | API server port (default: 5000) |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/satellites` | List all tracked satellites |
| `GET /api/satellites/:id` | Get satellite details |
| `GET /api/debris` | List debris and rocket bodies |
| `GET /api/analytics` | Orbital analytics summary |
| `GET /api/risk` | Risk scores leaderboard |
| `GET /api/collisions` | Collision warnings |
| `POST /api/admin/refresh` | Trigger manual data refresh |

## Data Sources

- **Satellite TLE Data** — [tle.ivanstanojevic.me](https://tle.ivanstanojevic.me) — live Two-Line Element sets for 25,000+ tracked objects
- **Debris Distribution** — ESA Space Debris Office orbital population models
- **Risk Scoring** — Multi-factor engine using altitude, eccentricity, inclination, debris proximity, and orbital congestion

## License

MIT
