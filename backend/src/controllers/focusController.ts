import { Request, Response } from "express";
import FocusSession from "../models/FocusSession.js";
import Task from "../models/Task.js";

export const startFocusSession = async (
  req: Request,
  res: Response
) => {
  try {
    const { taskId } = req.body;
    const userId = req.user?.userId;

    const activeSession = await FocusSession.findOne({
  user: userId,
  completed: false,
});

if (activeSession) {
  return res.status(400).json({
    success: false,
    message: "A focus session is already active",
      session: activeSession,
  });
}

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    // Make sure the task belongs to the logged-in user
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

    // Don't allow focus sessions for completed tasks
    if (task.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot start focus session for a completed task",
      });
    }


    const session = await FocusSession.create({
      user: userId,
      task: taskId,
      startTime: new Date(),
      completed: false,
    });

    return res.status(201).json({
      success: true,
      message: "Focus session started",
      session,
    });
  } catch (error) {
    console.error("Start Focus Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start focus session",
    });
  }
};

export const endFocusSession = async (
  req: Request,
  res: Response
) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user?.userId;

    const session = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      completed: false,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Active focus session not found",
      });
    }

    const endTime = new Date();

    const duration = Math.round(
      (endTime.getTime() -
        session.startTime.getTime()) /
        (1000 * 60)
    );

    session.endTime = endTime;
    session.duration = duration;
    session.completed = true;

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Focus session completed",
      session,
    });
  } catch (error) {
    console.error("End Focus Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to end focus session",
    });
  }
};

export const getFocusHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const sessions = await FocusSession.find({
      user: userId,
      completed: true,
    })
      .populate("task", "title")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });

  } catch (error) {
    console.error("Focus History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch focus history",
    });
  }
};

export const getFocusAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const sessions = await FocusSession.find({
      user: userId,
      completed: true,
    });

    const totalSessions = sessions.length;

    const totalFocusMinutes = sessions.reduce(
      (total, session) =>
        total + (session.duration || 0),
      0
    );

    const averageSessionMinutes =
      totalSessions > 0
        ? Math.round(
            totalFocusMinutes / totalSessions
          )
        : 0;

    const longestSessionMinutes =
      sessions.length > 0
        ? Math.max(
            ...sessions.map(
              (session) =>
                session.duration || 0
            )
          )
        : 0;

    return res.status(200).json({
      success: true,
      analytics: {
        totalSessions,
        totalFocusMinutes,
        averageSessionMinutes,
        longestSessionMinutes,
      },
    });

  } catch (error) {
    console.error(
      "Focus Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to calculate focus analytics",
    });
  }
};