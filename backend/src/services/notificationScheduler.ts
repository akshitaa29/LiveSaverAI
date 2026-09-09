import cron from "node-cron";

import User from "../models/User.js";
import Task from "../models/Task.js";

import {
  sendTodaysTasksEmail,
  sendTaskReminderEmail,
  sendTaskDueEmail,
  sendOverdueTaskEmail,
} from "./notificationService.js";


// ======================================================
// START NOTIFICATION SCHEDULER
// ======================================================

export const startNotificationScheduler = () => {

  // ====================================================
  // 1. TODAY'S TASKS EMAIL
  // Every day at 8:00 AM IST
  // ====================================================

  cron.schedule(
    "0 8 * * *",
    async () => {
      console.log(
        "📋 Running today's task notification..."
      );

      try {
        const users = await User.find(
          {},
          {
            _id: 1,
          }
        );

        for (const user of users) {
          try {
            const result =
              await sendTodaysTasksEmail(
                user._id.toString()
              );

            console.log(
              `📧 Today's tasks email for ${user._id}:`,
              result
            );

          } catch (error) {
            console.error(
              `❌ Today's task email failed for ${user._id}:`,
              error
            );
          }
        }

      } catch (error) {
        console.error(
          "❌ Today's tasks scheduler error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );


  // ====================================================
  // 2. CHECK REMINDERS
  // Every minute
  // ====================================================

  cron.schedule(
    "* * * * *",
    async () => {
      console.log(
        "⏰ Checking task reminders..."
      );

      try {
        const now = new Date();

        const oneMinuteAgo =
          new Date(
            now.getTime() - 60 * 1000
          );

        const reminderTasks =
          await Task.find({
            status: {
              $ne: "Completed",
            },

            reminderTime: {
              $gte: oneMinuteAgo,
              $lte: now,
            },

            reminderSent: false,
          });

        for (const task of reminderTasks) {
          try {

            await sendTaskReminderEmail(
              task._id.toString()
            );

            await Task.findByIdAndUpdate(
              task._id,
              {
                reminderSent: true,
              }
            );

            console.log(
              `✅ Reminder sent for task ${task._id}`
            );

          } catch (error) {
            console.error(
              `❌ Reminder email failed for ${task._id}:`,
              error
            );
          }
        }

      } catch (error) {
        console.error(
          "❌ Reminder scheduler error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );


  // ====================================================
  // 3. TASK DUE TODAY
  // Every minute
  //
  // Sends notification when deadline is reached.
  // ====================================================

  cron.schedule(
    "* * * * *",
    async () => {
      console.log(
        "⚠️ Checking tasks due today..."
      );

      try {

        const now = new Date();

        const {
          startOfDay,
          endOfDay,
        } = getTodayRangeIST();

        const tasks =
          await Task.find({
            status: {
              $ne: "Completed",
            },

            deadline: {
              $gte: startOfDay,
              $lte: endOfDay,
            },

            dueNotificationSent: false,
          });

        for (const task of tasks) {

          const deadline =
            new Date(task.deadline);

          /*
           * Send when current time has reached
           * the task deadline.
           */
          if (now >= deadline) {

            try {

              await sendTaskDueEmail(
                task._id.toString()
              );

              await Task.findByIdAndUpdate(
                task._id,
                {
                  dueNotificationSent: true,
                }
              );

              console.log(
                `✅ Due notification sent for task ${task._id}`
              );

            } catch (error) {

              console.error(
                `❌ Due email failed for ${task._id}:`,
                error
              );

            }
          }
        }

      } catch (error) {

        console.error(
          "❌ Due-date scheduler error:",
          error
        );

      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );


  // ====================================================
  // 4. OVERDUE TASK
  // Every minute
  // ====================================================

  cron.schedule(
    "* * * * *",
    async () => {

      console.log(
        "🚨 Checking overdue tasks..."
      );

      try {

        const now = new Date();

        const overdueTasks =
          await Task.find({
            status: {
              $ne: "Completed",
            },

            deadline: {
              $lt: now,
            },

            overdueNotificationSent: false,
          });

        for (const task of overdueTasks) {

          try {

            await sendOverdueTaskEmail(
              task._id.toString()
            );

            await Task.findByIdAndUpdate(
              task._id,
              {
                overdueNotificationSent: true,
              }
            );

            console.log(
              `✅ Overdue notification sent for task ${task._id}`
            );

          } catch (error) {

            console.error(
              `❌ Overdue email failed for ${task._id}:`,
              error
            );

          }
        }

      } catch (error) {

        console.error(
          "❌ Overdue scheduler error:",
          error
        );

      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );


  console.log(
    "⏰ Notification scheduler started"
  );
};


// ======================================================
// GET TODAY'S DATE RANGE IN IST
// ======================================================

const getTodayRangeIST = () => {

  const now = new Date();

  const istDate =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Kolkata",
      }
    ).format(now);

  const startOfDay =
    new Date(
      `${istDate}T00:00:00+05:30`
    );

  const endOfDay =
    new Date(
      `${istDate}T23:59:59.999+05:30`
    );

  return {
    startOfDay,
    endOfDay,
  };
};