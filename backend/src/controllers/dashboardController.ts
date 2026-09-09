import { Request, Response } from "express";
import Task from "../models/Task.js";
import Goal from "../models/Goal.js";

export const getDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const now = new Date();

    // -----------------------------------
    // Goals
    // -----------------------------------

    const [
      totalGoals,
      completedGoals,
      activeGoals,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    ] = await Promise.all([
      Goal.countDocuments({
        user: userId,
      }),

      Goal.countDocuments({
        user: userId,
        status: "Completed",
      }),

      Goal.countDocuments({
        user: userId,
        status: {
          $ne: "Completed",
        },
      }),

      Task.countDocuments({
        user: userId,
      }),

      Task.countDocuments({
        user: userId,
        status: "Completed",
      }),

      Task.countDocuments({
        user: userId,
        status: {
          $ne: "Completed",
        },
      }),

      Task.countDocuments({
        user: userId,
        status: {
          $ne: "Completed",
        },
        deadline: {
          $lt: now,
        },
      }),
    ]);

    // -----------------------------------
    // Overall progress
    // -----------------------------------

    const overallProgress =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    // -----------------------------------
    // Response
    // -----------------------------------

    return res.status(200).json({
      success: true,
      dashboard: {
        totalGoals,
        activeGoals,
        completedGoals,

        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,

        overallProgress,
      },
    });

  } catch (error) {
    console.error(
      "Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};