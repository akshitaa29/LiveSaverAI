import { Request, Response } from "express";
import Task from "../models/Task.js";
import { analyzeTask, AIAnalysis } from "../services/aiService.js";
import { updateGoalProgress } from "../services/goalProgressService.js";
import { regenerateTaskDeadlines } from "../services/taskReschedulerService.js";

export const createTask = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      description,
      deadline,
      priority,
      goal,
      taskType,
      reminderTime,
    } = req.body;

    const userId = req.user?.userId;

    // ==============================
    // BASIC VALIDATION
    // ==============================

    if (!title || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Title and deadline are required",
      });
    }

    // ==============================
    // AI ANALYSIS
    // ==============================

    let aiAnalysis: AIAnalysis;

    try {
      aiAnalysis = await analyzeTask(
        title,
        description ?? "",
        deadline
      );
    } catch (error) {
      console.error("AI Analysis Error:", error);

      return res.status(500).json({
        success: false,
        message: "AI could not analyze the task.",
      });
    }

    // ==============================
    // PRIORITY
    // ==============================

    const finalPriority =
      priority === "Low" ||
      priority === "Medium" ||
      priority === "High"
        ? priority
        : aiAnalysis.priority;

    // ==============================
    // TASK TYPE
    // ==============================

    const finalTaskType =
      taskType === "Reminder" || taskType === "Action"
        ? taskType
        : aiAnalysis.taskType;

    // ==============================
    // COMMON TASK DATA
    // ==============================

    const taskData: any = {
      title,
      description,
      deadline,
      goal,
      user: userId,
      taskType: finalTaskType,
      priority: finalPriority,
    };

    // ==============================
    // REMINDER TASK
    // ==============================

    if (finalTaskType === "Reminder") {

      if (!reminderTime) {
        return res.status(400).json({
          success: false,
          message: "Reminder time is required for reminder tasks",
        });
      }

      taskData.reminderTime = new Date(reminderTime);

    } else {

      // ==============================
      // ACTION TASK
      // ==============================

      taskData.difficulty = aiAnalysis.difficulty;

      taskData.estimatedHours =
        aiAnalysis.estimatedHours;

      taskData.riskScore =
        aiAnalysis.riskScore;

      taskData.aiRecommendation =
        aiAnalysis.recommendation;
    }

    // ==============================
    // CREATE TASK
    // ==============================

    const task = await Task.create(taskData);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error("Create Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyTasks = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const tasks = await Task.find({
      user: userId,
    }).sort({
      deadline: 1,
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response
) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.userId;

    const task = await Task.findOne({
      _id: taskId,
      user: userId,
    });

if (!task) {
  return res.status(404).json({
    success: false,
    message: "Task not found",
  });
}

if (task.goal) {
  await updateGoalProgress(task.goal.toString());
}

    return res.status(200).json({
      success: true,
       message: "Task deleted successfully",
      task,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.userId;

    const {
      title,
      description,
      deadline,
      priority,
      status,
      taskType,
      reminderTime,
      difficulty,
      estimatedHours,
      riskScore,
      aiRecommendation,
      goal,
    } = req.body;

    // -----------------------------------
    // 1. Find task belonging to user
    // -----------------------------------

    const task = await Task.findOne({
      _id: taskId,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // -----------------------------------
    // 2. Validate fields if provided
    // -----------------------------------

    if (
      priority !== undefined &&
      !["Low", "Medium", "High"].includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    if (
      status !== undefined &&
      !["Pending", "In Progress", "Completed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (
      taskType !== undefined &&
      !["Action", "Reminder"].includes(taskType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task type",
      });
    }

    if (
      difficulty !== undefined &&
      !["Easy", "Medium", "Hard"].includes(difficulty)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty",
      });
    }

    if (
      estimatedHours !== undefined &&
      (typeof estimatedHours !== "number" ||
        estimatedHours <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Estimated hours must be greater than 0",
      });
    }

    if (
      riskScore !== undefined &&
      (typeof riskScore !== "number" ||
        riskScore < 0 ||
        riskScore > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Risk score must be between 0 and 100",
      });
    }

    // -----------------------------------
    // 3. Update only provided fields
    // -----------------------------------

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (deadline !== undefined) {
      const parsedDeadline = new Date(deadline);

      if (isNaN(parsedDeadline.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid deadline",
        });
      }

      task.deadline = parsedDeadline;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (taskType !== undefined) {
      task.taskType = taskType;
    }

    if (reminderTime !== undefined) {
      task.reminderTime = reminderTime
        ? new Date(reminderTime)
        : undefined;
    }

    if (difficulty !== undefined) {
      task.difficulty = difficulty;
    }

    if (estimatedHours !== undefined) {
      task.estimatedHours = estimatedHours;
    }

    if (riskScore !== undefined) {
      task.riskScore = riskScore;
    }

    if (aiRecommendation !== undefined) {
      task.aiRecommendation = aiRecommendation;
    }

    // -----------------------------------
    // 4. Handle goal change
    // -----------------------------------

    const oldGoalId = task.goal
      ? task.goal.toString()
      : null;

    if (goal !== undefined) {
      task.goal = goal || undefined;
    }

    // -----------------------------------
    // 5. Save task
    // -----------------------------------

    const updatedTask = await task.save();

    // -----------------------------------
    // 6. Update old goal progress
    // -----------------------------------

    if (oldGoalId && oldGoalId !== goal) {
      await updateGoalProgress(oldGoalId);
    }

    // -----------------------------------
    // 7. Update new goal progress
    // -----------------------------------

    if (updatedTask.goal) {
      await updateGoalProgress(
        updatedTask.goal.toString()
      );
    }

    // -----------------------------------
    // 8. Return response
    // -----------------------------------

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });

  } catch (error) {
    console.error("Update Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.userId;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Recalculate goal progress after deleting the task
    if (task.goal) {
      await updateGoalProgress(
        task.goal.toString()
      );
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error("Delete Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getTasksByGoal = async (
  req: Request,
  res: Response
) => {
  try {
    const goalId = req.params.goalId;
    const userId = req.user?.userId;

    const tasks = await Task.find({
      goal: goalId,
      user: userId,
    }).sort({
      deadline: 1,
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const regenerateTask = async (
  req: Request,
  res: Response
) => {
  try {
    const taskId = req.params.id as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // -----------------------------------
    // 1. Generate new deadlines using AI
    // -----------------------------------

    const rescheduledTasks =
      await regenerateTaskDeadlines(
        taskId,
        userId
      );

    // -----------------------------------
    // 2. Update tasks in MongoDB
    // -----------------------------------

    const updatedTasks = [];

    for (const item of rescheduledTasks) {
      const updatedTask =
        await Task.findOneAndUpdate(
          {
            _id: item.taskId,
            user: userId,
          },
          {
            deadline: new Date(item.deadline),
          },
          {
            new: true,
          }
        );

      if (updatedTask) {
        updatedTasks.push(updatedTask);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Task plan regenerated successfully",
      tasks: updatedTasks,
    });

  } catch (error) {
    console.error(
      "Regenerate Task Error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Server Error";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};