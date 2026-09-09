import express from "express";

import {
  createTask,
  getMyTasks,
  getTaskById,
  getTasksByGoal,
  updateTask,
  deleteTask,
  regenerateTask,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

import { sendTodaysTasksEmail } from "../services/notificationService.js";


const router = express.Router();

router.post("/", protect, createTask);

router.get("/", protect, getMyTasks);

// Get all tasks belonging to a specific goal
router.get("/goal/:goalId", protect, getTasksByGoal);

router.post(
  "/test/todays-tasks-email",
  protect,
  async (req, res) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await sendTodaysTasksEmail(userId);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error(
        "Today's Tasks Email Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to send today's tasks email",
      });
    }
  }
);

router.get("/:id", protect, getTaskById);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, deleteTask);

router.post("/:id/regenerate", protect, regenerateTask);
router.get("/:id", protect, getTaskById);

export default router;