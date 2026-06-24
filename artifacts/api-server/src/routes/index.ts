import { Router, type IRouter } from "express";
import healthRouter from "./health";
import satellitesRouter from "./satellites";
import debrisRouter from "./debris";
import analyticsRouter from "./analytics";
import riskRouter from "./risk";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/satellites", satellitesRouter);
router.use("/debris", debrisRouter);
router.use("/analytics", analyticsRouter);
router.use("/risk", riskRouter);
router.use(adminRouter);

export default router;
