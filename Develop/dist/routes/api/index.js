import { Router } from "express";
import { thoughtRouter } from "./thoughtRoutes.js";
import { usertRouter } from "./userRoutes.js";
const router = Router();
router.use("/thoughts", thoughtsRouter);
router.use("/user", userRouter);
export default router;
