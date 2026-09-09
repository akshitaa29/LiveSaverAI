import express from "express";
import {
  startFocusSession,
  endFocusSession,
  getFocusHistory,
  getFocusAnalytics,
} from "../controllers/focusController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Start a focus session
router.post(
  "/start",
  protect,
  startFocusSession
);

// End a focus session
router.put(
  "/end/:id",
  protect,
  endFocusSession
);

// Get focus history
router.get(
  "/history",
  protect,
  getFocusHistory
);

// Get focus analytics
router.get(
  "/analytics",
  protect,
  getFocusAnalytics
);

export default router;