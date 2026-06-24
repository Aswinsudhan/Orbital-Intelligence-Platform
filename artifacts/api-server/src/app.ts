import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import cron from "node-cron";
import router from "./routes";
import { logger } from "./lib/logger";
import { performDataRefresh, setNextRefresh } from "./lib/data-service";

const app: Express = express();

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

function scheduleNextRefresh() {
  const next = new Date();
  next.setMinutes(next.getMinutes() + 30);
  setNextRefresh(next);
}

cron.schedule("*/30 * * * *", async () => {
  logger.info("Scheduled data refresh starting");
  scheduleNextRefresh();
  await performDataRefresh("scheduler");
});

scheduleNextRefresh();

const runInitialRefresh = process.env.SKIP_INITIAL_FETCH !== "true";
if (runInitialRefresh) {
  setImmediate(async () => {
    logger.info("Running initial data fetch from CelesTrak");
    await performDataRefresh("startup");
  });
}

export default app;
