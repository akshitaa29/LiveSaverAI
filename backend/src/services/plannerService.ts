export interface AvailableTime {
  start: string;
  end: string;
}

export interface PlannerTask {
  taskId: string;
  title: string;
  deadline: string;
  priority: "Low" | "Medium" | "High";
  estimatedHours: number;
  riskScore: number;
  taskType: "Action" | "Reminder";
  status?: "Pending" | "In Progress" | "Completed";
  reminderTime?: string;
}

export interface PlannerInput {
  date: string;
  availableTime: AvailableTime[];
  tasks: PlannerTask[];
}

export interface ScheduledTask {
  taskId: string;
  title: string;
  type: "Action" | "Reminder";

  startTime?: string;
  endTime?: string;

  reminderTime?: string;

  priority: "Low" | "Medium" | "High";
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    mins
  ).padStart(2, "0")}`;
}

function getPriorityScore(
  priority: "Low" | "Medium" | "High"
): number {
  switch (priority) {
    case "High":
      return 3;

    case "Medium":
      return 2;

    case "Low":
      return 1;

    default:
      return 0;
  }
}

function getDeadlineUrgency(
  deadline: string,
  date: string
): number {
  const deadlineDate = new Date(deadline);
  const plannerDate = new Date(date);

  const difference =
    deadlineDate.getTime() -
    plannerDate.getTime();

  const daysRemaining =
    difference /
    (1000 * 60 * 60 * 24);

  /*
   * Smaller number of remaining days
   * means higher urgency.
   */

  if (daysRemaining <= 0) {
    return 5;
  }

  if (daysRemaining <= 1) {
    return 5;
  }

  if (daysRemaining <= 3) {
    return 4;
  }

  if (daysRemaining <= 7) {
    return 3;
  }

  if (daysRemaining <= 14) {
    return 2;
  }

  return 1;
}

function getRiskScore(riskScore: number): number {
  if (riskScore >= 80) {
    return 5;
  }

  if (riskScore >= 60) {
    return 4;
  }

  if (riskScore >= 40) {
    return 3;
  }

  if (riskScore >= 20) {
    return 2;
  }

  return 1;
}

function calculateTaskScore(
  task: PlannerTask,
  date: string
): number {
  const priorityScore =
    getPriorityScore(task.priority);

  const deadlineScore =
    getDeadlineUrgency(
      task.deadline,
      date
    );

  const riskScore =
    getRiskScore(task.riskScore);

  /*
   * Priority is given the highest weight
   * because an explicitly important task
   * should be scheduled earlier.
   *
   * Deadline and risk are also important.
   */

  return (
    priorityScore * 5 +
    deadlineScore * 3 +
    riskScore * 2
  );
}

export function generateDailyPlan(
  input: PlannerInput
): ScheduledTask[] {
  const {
    date,
    availableTime,
    tasks,
  } = input;

  /*
   * -----------------------------------------
   * STEP 1
   * Remove completed tasks.
   * -----------------------------------------
   */

  const pendingTasks = tasks.filter(
    (task) =>
      task.status !== "Completed"
  );

  /*
   * -----------------------------------------
   * STEP 2
   * Separate Action tasks and Reminders.
   * -----------------------------------------
   */

  const actionTasks =
    pendingTasks.filter(
      (task) =>
        task.taskType === "Action"
    );

  const reminderTasks =
    pendingTasks.filter(
      (task) =>
        task.taskType === "Reminder"
    );

  /*
   * -----------------------------------------
   * STEP 3
   * Calculate priority score for every
   * Action task.
   * -----------------------------------------
   */

  const sortedActionTasks =
    [...actionTasks].sort(
      (a, b) =>
        calculateTaskScore(
          b,
          date
        ) -
        calculateTaskScore(
          a,
          date
        )
    );

  /*
   * -----------------------------------------
   * STEP 4
   * Convert available time into minute
   * ranges.
   * -----------------------------------------
   */

  const availableRanges =
    availableTime.map(
      (range) => ({
        start: timeToMinutes(
          range.start
        ),

        end: timeToMinutes(
          range.end
        ),
      })
    );

  /*
   * -----------------------------------------
   * STEP 5
   * Schedule Action tasks.
   * -----------------------------------------
   */

  const scheduledTasks: ScheduledTask[] =
    [];

  for (const task of sortedActionTasks) {
    const requiredMinutes = Math.max(
      30,
      Math.ceil(
        task.estimatedHours * 60
      )
    );

    let scheduled = false;

    for (
      let rangeIndex = 0;
      rangeIndex <
      availableRanges.length;
      rangeIndex++
    ) {
      const range =
        availableRanges[rangeIndex];

      if (
        range.end - range.start <
        requiredMinutes
      ) {
        continue;
      }

      const start =
        range.start;

      const end =
        start + requiredMinutes;

      if (end > range.end) {
        continue;
      }

      scheduledTasks.push({
        taskId: task.taskId,
        title: task.title,
        type: "Action",
        startTime:
          minutesToTime(start),
        endTime:
          minutesToTime(end),
        priority: task.priority,
      });

      /*
       * Remove the time that was used.
       */

      range.start = end;

      scheduled = true;

      break;
    }

    /*
     * If there is not enough time today,
     * the task is simply not scheduled.
     *
     * It remains pending and can be
     * considered on the next planner run.
     */

    if (!scheduled) {
      continue;
    }
  }

  /*
   * STEP 6
   * Add reminders.
   * Reminders don't consume work time.
   */

for (const reminder of reminderTasks) {
  const reminderTime =
    reminder.reminderTime ?? reminder.deadline;

  // Only include reminders that belong to the planner date
  const reminderDate =
    new Date(reminderTime)
      .toISOString()
      .split("T")[0];

  if (reminderDate !== date) {
    continue;
  }

  scheduledTasks.push({
    taskId: reminder.taskId,
    title: reminder.title,
    type: "Reminder",
    reminderTime,
    priority: reminder.priority,
  });
}

  /*
   * -----------------------------------------
   * STEP 7
   * Sort final schedule chronologically.
   * -----------------------------------------
   */

  scheduledTasks.sort(
    (a, b) => {
      const timeA =
        a.type === "Reminder"
          ? a.reminderTime
          : a.startTime;

      const timeB =
        b.type === "Reminder"
          ? b.reminderTime
          : b.startTime;

      return (
        new Date(
          `${date}T${timeA}`
        ).getTime() -
        new Date(
          `${date}T${timeB}`
        ).getTime()
      );
    }
  );

  return scheduledTasks;
}