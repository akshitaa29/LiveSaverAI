import { generateDailyPlan } from "./services/plannerService.js";

const input = {
  date: "2026-08-12",

  availableTime: [
    {
      start: "18:00",
      end: "22:00",
    },
  ],

  tasks: [
    {
      taskId: "task1",
      title: "Complete Resume",
      deadline: "2026-08-15T18:00:00Z",
      priority: "High" as const,
      estimatedHours: 2,
      riskScore: 70,
      taskType: "Action" as const,
      status: "Pending" as const,
    },

    {
      taskId: "task2",
      title: "Learn Node.js",
      deadline: "2026-08-20T18:00:00Z",
      priority: "High" as const,
      estimatedHours: 1,
      riskScore: 30,
      taskType: "Action" as const,
      status: "Pending" as const,
    },

    {
      taskId: "task3",
      title: "Practice DSA",
      deadline: "2026-08-30T18:00:00Z",
      priority: "Medium" as const,
      estimatedHours: 1,
      riskScore: 20,
      taskType: "Action" as const,
      status: "Pending" as const,
    },

    {
      taskId: "task4",
      title: "Pay Electricity Bill",
      deadline: "2026-08-12T20:00:00Z",
      priority: "High" as const,
      estimatedHours: 0,
      riskScore: 0,
      taskType: "Reminder" as const,
      status: "Pending" as const,
      reminderTime: "20:00",
    },
  ],
};

const result = generateDailyPlan(input);

console.log(
  JSON.stringify(result, null, 2)
);