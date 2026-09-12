import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// ---------------------------------------------------------------------------
// Security: Disable fingerprinting header
// ---------------------------------------------------------------------------
app.disable("x-powered-by");

// ---------------------------------------------------------------------------
// Logging middleware
// ---------------------------------------------------------------------------
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// ---------------------------------------------------------------------------
// Security headers (manual helmet-equivalent, no extra dep needed)
// ---------------------------------------------------------------------------
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none';",
  );
  next();
});

// ---------------------------------------------------------------------------
// CORS: Restrict to frontend origin when set, fallback to Cloudflare Pages default
// ---------------------------------------------------------------------------
const corsOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL;
const allowedOrigins = corsOrigin
  ? corsOrigin.split(",").map((o) => o.trim())
  : [
      "https://orbital-intelligence-platform.pages.dev",
      "http://localhost:5173",
      "http://localhost:3000",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      logger.warn({ origin }, "CORS blocked request from unlisted origin");
      callback(new Error("CORS policy: origin not permitted"));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Key"],
  }),
);

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (no extra dependency)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function createRateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count++;
    if (entry.count > maxRequests) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000).toString());
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return;
    }

    next();
  };
}

// General API rate limit: 200 requests per minute per IP
const generalLimiter = createRateLimiter(200, 60 * 1000);

// Stricter limit for admin endpoints: 10 per minute per IP
const adminLimiter = createRateLimiter(10, 60 * 1000);

// ---------------------------------------------------------------------------
// Admin API Key Authentication Middleware
// ---------------------------------------------------------------------------
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  // If no ADMIN_SECRET is configured in env, reject all admin calls to be safe
  if (!ADMIN_SECRET) {
    logger.error("ADMIN_SECRET env var not set — admin endpoint blocked");
    res.status(503).json({
      error: "Admin endpoints are disabled: ADMIN_SECRET environment variable is not configured.",
    });
    return;
  }

  const provided = req.headers["x-admin-key"] as string | undefined;
  if (!provided || provided !== ADMIN_SECRET) {
    logger.warn({ ip: req.ip }, "Unauthorized admin access attempt");
    res.status(401).json({ error: "Unauthorized: valid X-Admin-Key header required." });
    return;
  }

  next();
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Apply rate limiters
app.use("/api/admin", adminLimiter);
app.use("/api", generalLimiter);

app.use("/api", router);

// ---------------------------------------------------------------------------
// Global error handler: never expose internal error details
// ---------------------------------------------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

logger.info("Auto-sync disabled — data refresh is manual only via Admin panel");

export default app;
