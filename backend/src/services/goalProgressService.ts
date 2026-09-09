import Goal from "../models/Goal.js";
import Task from "../models/Task.js";

export const updateGoalProgress = async (
  goalId: string
) => {
  const goal = await Goal.findById(goalId);

  if (!goal) {
    return null;
  }

  const tasks = await Task.find({
    goal: goalId,
  });

  if (tasks.length === 0) {
    goal.progress = 0;
    goal.status = "Not Started";

    await goal.save();

    return goal;
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const progress = Math.round(
    (completedTasks / tasks.length) * 100
  );

  goal.progress = progress;

  if (progress === 0) {
    goal.status = "Not Started";
  } else if (progress === 100) {
    goal.status = "Completed";
  } else {
    goal.status = "In Progress";
  }

  await goal.save();

  return goal;
};