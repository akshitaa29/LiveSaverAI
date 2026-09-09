import express from "express";
import { generatePlanner } from "../controllers/planControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate",
  protect,
  generatePlanner
);

export default router;