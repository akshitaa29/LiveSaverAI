import cron from "node-cron";

import User from "../models/User.js";
import Task from "../models/Task.js";
import { sendEmail } from "./emailService.js";

// ============================================================
// 1. TODAY'S TASKS EMAIL
// ============================================================

export const sendTodaysTasksEmail = async (
  userId: string
) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: userId,
      status: {
        $ne: "Completed",
      },
      deadline: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({
      deadline: 1,
    });

    if (tasks.length === 0) {
      return {
        sent: false,
        message: "No tasks due today",
      };
    }

    const taskHtml = tasks
      .map(
        (task) => `
          <div>
            <h3>${task.title}</h3>

            <p>
              ${task.description || ""}
            </p>

            <p>
              <strong>Priority:</strong>
              ${task.priority || "Not specified"}
            </p>

            <p>
              <strong>Difficulty:</strong>
              ${task.difficulty || "Not specified"}
            </p>

            <p>
              <strong>Deadline:</strong>
              ${new Date(task.deadline).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <hr />
        `
      )
      .join("");

    await sendEmail({
      to: user.email,
      subject: "Your tasks for today - LiveAISaver",
      html: `
        <h2>Good morning, ${user.fullName} 👋</h2>

        <p>
          Here are your pending tasks for today:
        </p>

        ${taskHtml}

        <p>
          Stay focused and complete your tasks today! 💪
        </p>

        <p>
          — LiveAISaver Team
        </p>
      `,
    });

    return {
      sent: true,
      taskCount: tasks.length,
    };
  } catch (error) {
    console.error(
      "Today's Tasks Email Error:",
      error
    );

    throw error;
  }
};


// ============================================================
// 2. TASK REMINDER EMAIL
// ============================================================

export const sendTaskReminderEmail = async (
  taskId: string
) => {
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.status === "Completed") {
      return {
        sent: false,
        message: "Task already completed",
      };
    }

    const user = await User.findById(task.user);

    if (!user) {
      throw new Error("User not found");
    }

    await sendEmail({
      to: user.email,
      subject: `Reminder: ${task.title} - LiveAISaver`,
      html: `
        <h2>Task Reminder 🔔</h2>

        <p>
          Hi ${user.fullName},
        </p>

        <p>
          This is a reminder for your task:
        </p>

        <h3>${task.title}</h3>

        <p>
          ${task.description || ""}
        </p>

        <p>
          <strong>Deadline:</strong>
          ${new Date(task.deadline).toLocaleString(
            "en-IN"
          )}
        </p>

        <p>
          <strong>Priority:</strong>
          ${task.priority || "Not specified"}
        </p>

        <p>
          Don't forget to complete it! 💪
        </p>

        <p>
          — LiveAISaver Team
        </p>
      `,
    });

    return {
      sent: true,
      taskId,
    };
  } catch (error) {
    console.error(
      "Task Reminder Email Error:",
      error
    );

    throw error;
  }
};


// ============================================================
// 3. TASK DUE TODAY EMAIL
// ============================================================

export const sendTaskDueEmail = async (
  userId: string
) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: userId,
      status: {
        $ne: "Completed",
      },
      deadline: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({
      deadline: 1,
    });

    if (tasks.length === 0) {
      return {
        sent: false,
        message: "No tasks due today",
      };
    }

    const taskHtml = tasks
      .map(
        (task) => `
          <div>
            <h3>${task.title}</h3>

            <p>
              ${task.description || ""}
            </p>

            <p>
              <strong>Deadline:</strong>
              ${new Date(task.deadline).toLocaleString(
                "en-IN"
              )}
            </p>

            <p>
              <strong>Priority:</strong>
              ${task.priority || "Not specified"}
            </p>
          </div>

          <hr />
        `
      )
      .join("");

    await sendEmail({
      to: user.email,
      subject: "Tasks due today - LiveAISaver",
      html: `
        <h2>Tasks Due Today ⚠️</h2>

        <p>
          Hi ${user.fullName},
        </p>

        <p>
          The following tasks are due today:
        </p>

        ${taskHtml}

        <p>
          Try to complete them before the deadline.
        </p>

        <p>
          — LiveAISaver Team
        </p>
      `,
    });

    return {
      sent: true,
      taskCount: tasks.length,
    };
  } catch (error) {
    console.error(
      "Task Due Email Error:",
      error
    );

    throw error;
  }
};


// ============================================================
// 4. OVERDUE TASK EMAIL
// ============================================================

export const sendOverdueTaskEmail = async (
  userId: string
) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();

    const tasks = await Task.find({
      user: userId,
      status: {
        $ne: "Completed",
      },
      deadline: {
        $lt: now,
      },
    }).sort({
      deadline: 1,
    });

    if (tasks.length === 0) {
      return {
        sent: false,
        message: "No overdue tasks",
      };
    }

    const taskHtml = tasks
      .map(
        (task) => `
          <div>
            <h3>${task.title}</h3>

            <p>
              ${task.description || ""}
            </p>

            <p>
              <strong>Deadline:</strong>
              ${new Date(task.deadline).toLocaleString(
                "en-IN"
              )}
            </p>

            <p>
              <strong>Priority:</strong>
              ${task.priority || "Not specified"}
            </p>
          </div>

          <hr />
        `
      )
      .join("");

    await sendEmail({
      to: user.email,
      subject: "You have overdue tasks - LiveAISaver",
      html: `
        <h2>Overdue Tasks ⚠️</h2>

        <p>
          Hi ${user.fullName},
        </p>

        <p>
          The following tasks have passed their deadlines:
        </p>

        ${taskHtml}

        <p>
          Please review these tasks and reschedule them
          if necessary.
        </p>

        <p>
          — LiveAISaver Team
        </p>
      `,
    });

    return {
      sent: true,
      taskCount: tasks.length,
    };
  } catch (error) {
    console.error(
      "Overdue Task Email Error:",
      error
    );

    throw error;
  }
};


// ============================================================
// 5. CHECK TASK REMINDERS
// ============================================================

const checkTaskReminders = async () => {
  try {
    const now = new Date();

    const oneMinuteAgo = new Date(
      now.getTime() - 60 * 1000
    );

    const tasks = await Task.find({
      status: {
        $ne: "Completed",
      },

      reminderSent: false,

      reminderTime: {
        $gte: oneMinuteAgo,
        $lte: now,
      },
    });

    console.log(
      `Checking task reminders: ${tasks.length} found`
    );

    for (const task of tasks) {
      try {
        await sendTaskReminderEmail(
          task._id.toString()
        );

        // Mark reminder as sent
        await Task.findByIdAndUpdate(
          task._id,
          {
            reminderSent: true,
          }
        );

        console.log(
          `Reminder sent for task: ${task.title}`
        );

      } catch (error) {
        console.error(
          `Failed reminder for task ${task._id}:`,
          error
        );
      }
    }

  } catch (error) {
    console.error(
      "Reminder Scheduler Error:",
      error
    );
  }
};

// ============================================================
// 6. NOTIFICATION SCHEDULER
// ============================================================

export const startNotificationScheduler = () => {

  // ----------------------------------------------------------
  // TODAY'S TASKS
  // Every day at 8:00 AM IST
  // ----------------------------------------------------------

  cron.schedule(
    "0 8 * * *",
    async () => {
      try {
        console.log(
          "Running today's tasks notification..."
        );

        const users = await User.find({});

        for (const user of users) {
          try {
            await sendTodaysTasksEmail(
              user._id.toString()
            );
          } catch (error) {
            console.error(
              `Today's task email failed for ${user.email}:`,
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "Today's Tasks Scheduler Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );


  // ----------------------------------------------------------
  // TASK DUE TODAY
  // Every day at 9:00 AM IST
  // ----------------------------------------------------------

  cron.schedule(
    "0 9 * * *",
    async () => {
      try {
        console.log(
          "Running task due notification..."
        );

        const users = await User.find({});

        for (const user of users) {
          try {
            await sendTaskDueEmail(
              user._id.toString()
            );
          } catch (error) {
            console.error(
              `Task due email failed for ${user.email}:`,
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "Task Due Scheduler Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );


  // ----------------------------------------------------------
  // OVERDUE TASKS
  // Every day at 7:00 PM IST
  // ----------------------------------------------------------

  cron.schedule(
    "0 19 * * *",
    async () => {
      try {
        console.log(
          "Running overdue task notification..."
        );

        const users = await User.find({});

        for (const user of users) {
          try {
            await sendOverdueTaskEmail(
              user._id.toString()
            );
          } catch (error) {
            console.error(
              `Overdue email failed for ${user.email}:`,
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "Overdue Scheduler Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );


  // ----------------------------------------------------------
  // CUSTOM TASK REMINDERS
  // Check every minute
  // ----------------------------------------------------------

  cron.schedule(
    "* * * * *",
    async () => {
      await checkTaskReminders();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );


  console.log(
    "🔔 Notification scheduler started"
  );

  console.log(
    "📅 Today's tasks: 8:00 AM IST"
  );

  console.log(
    "⏰ Task due notification: 9:00 AM IST"
  );

  console.log(
    "⚠️ Overdue tasks: 7:00 PM IST"
  );

  console.log(
    "🔔 Custom reminders: Every minute"
  );
};