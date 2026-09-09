import { Request, Response } from "express";
import Goal from "../models/Goal.js";
import Task from "../models/Task.js";

import { generateGoalTasks } from "../services/goalGeneratorService.js";
// import { analyzeTask } from "../services/aiService.js";

export const createGoal = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      description,
      targetDate,
    } = req.body;

    const userId = req.user?.userId;

    if (!title || !targetDate) {
      return res.status(400).json({
        success: false,
        message:
          "Title and target date are required",
      });
    }

    // -----------------------------------
    // 1. Create Goal
    // -----------------------------------

    const goal = await Goal.create({
      title,
      description,
      targetDate,
      user: userId,
    });

    // -----------------------------------
    // 2. ONE AI CALL
    // -----------------------------------

    const generatedTasks =
      await generateGoalTasks(
        title,
        description ?? "",
        targetDate
      );

    // -----------------------------------
    // 3. Create Tasks
    // -----------------------------------

    const createdTasks = [];

    for (const generatedTask of generatedTasks) {
      const taskDeadline =
        new Date(generatedTask.deadline);

      // Safety check
      const goalDeadline =
        new Date(targetDate);

      if (
        isNaN(taskDeadline.getTime()) ||
        taskDeadline > goalDeadline
      ) {
        throw new Error(
          "AI generated an invalid task deadline"
        );
      }

      const task = await Task.create({
        title: generatedTask.title,

        description:
          generatedTask.description,

        deadline: taskDeadline,

        priority:
          generatedTask.priority,

        status: "Pending",

        taskType: "Action",

        difficulty:
          generatedTask.difficulty,

        estimatedHours:
          generatedTask.estimatedHours,

        riskScore:
          generatedTask.riskScore,

        aiRecommendation:
          generatedTask.aiRecommendation,

        goal: goal._id,

        user: userId,
      });

      createdTasks.push(task);
    }

    // -----------------------------------
    // 4. Return Response
    // -----------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Goal created successfully",

      goal,

      tasks: createdTasks,
    });

  } catch (error) {
    console.error(
      "Create Goal Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const getMyGoals = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const goals = await Goal.find({
      user: userId,
    }).sort({
      targetDate: 1,
    });

    return res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const getGoalById = async (
  req: Request,
  res: Response
) => {
  try {
    const goalId = req.params.id;
    const userId = req.user?.userId;

    const goal = await Goal.findOne({
      _id: goalId,
      user: userId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const tasks = await Task.find({
      goal: goal._id,
      user: userId,
    }).sort({
      deadline: 1,
    });

    return res.status(200).json({
      success: true,
      goal,
      tasks,
    });

  } catch (error) {
    console.error("Get Goal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const updateGoal = async (
  req: Request,
  res: Response
) => {
  try {
    const goalId = req.params.id;
    const userId = req.user?.userId;

    const {
      title,
      description,
      targetDate,
      category,
      progress,
      status,
    } = req.body;

    if (!title || !targetDate || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, target date and category are required",
      });
    }

    const updatedGoal = await Goal.findOneAndUpdate(
      {
        _id: goalId,
        user: userId,
      },
      {
        title,
        description,
        targetDate,
        category,
        progress,
        status,
      },
      {
        new: true,
      }
    );

    if (!updatedGoal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      goal: updatedGoal,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const deleteGoal = async (
  req: Request,
  res: Response
) => {
  try {
    const goalId = req.params.id;
    const userId = req.user?.userId;

    // First check that the goal belongs to the logged-in user
    const goal = await Goal.findOne({
      _id: goalId,
      user: userId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    // Delete all tasks belonging to this goal
    await Task.deleteMany({
      goal: goal._id,
      user: userId,
    });

    // Delete the goal
    await Goal.deleteOne({
      _id: goal._id,
      user: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Goal and associated tasks deleted successfully",
    });

  } catch (error) {
    console.error("Delete Goal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};