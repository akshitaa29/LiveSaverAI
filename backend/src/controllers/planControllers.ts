import { Request, Response } from "express";
import Task from "../models/Task.js";
import { generateDailyPlan, PlannerTask } from "../services/plannerService.js";

export const generatePlanner = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      date,
      availableTime,
    } = req.body;

    const userId = req.user?.userId;

    // Validate required input
    if (!date || !availableTime) {
      return res.status(400).json({
        success: false,
        message: "Date and available time are required", 
      });
    }

    // Validate availableTime format
    if (!Array.isArray(availableTime)) {
      return res.status(400).json({
        success: false,
        message: "availableTime must be an array",
      });
    }

    /*
     * Get user's pending tasks.
     *
     * We don't want completed tasks to be considered
     * by the planner.
     */
    const tasks = await Task.find({
      user: userId,
      status: {
        $ne: "Completed",
      },
    });

    /*
     * Convert MongoDB task objects into the
     * structure expected by plannerService.
     */
    const plannerTasks: PlannerTask[] = tasks.map(
      (task) => ({
        taskId: task._id.toString(),

        title: task.title,

        deadline: task.deadline.toISOString(),

       priority:
         (task.priority || "Medium") as
                | "Low"
                | "Medium"
                | "High",

        estimatedHours:
          task.estimatedHours || 1,

        riskScore:
          task.riskScore || 0,

        taskType:
          task.taskType as
            | "Action"
            | "Reminder",

        status:
          task.status as
            | "Pending"
            | "In Progress"
            | "Completed",

        reminderTime:
          task.reminderTime
            ? task.reminderTime.toISOString()
            : undefined,
      })
    );

    /*
     * Generate today's schedule.
     */
    const schedule = generateDailyPlan({
      date,
      availableTime,
      tasks: plannerTasks,
    });

    return res.status(200).json({
      success: true,
      message: "Daily plan generated successfully",
      date,
      availableTime,
      schedule,
    });

  } catch (error) {
    console.error(
      "Planner Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate daily plan",
    });
  }
};