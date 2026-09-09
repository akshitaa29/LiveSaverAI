import Task from "../models/Task.js";
import Goal from "../models/Goal.js";
import groq from "./aiService.js";

interface RescheduledTask {
  taskId: string;
  deadline: string;
}

// ==========================================
// Extract JSON from AI response
// ==========================================

function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Try complete JSON first
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue
  }

  // Try extracting JSON object
  const objectStart = cleaned.indexOf("{");
  const objectEnd = cleaned.lastIndexOf("}");

  if (
    objectStart !== -1 &&
    objectEnd !== -1 &&
    objectEnd > objectStart
  ) {
    try {
      return JSON.parse(
        cleaned.slice(objectStart, objectEnd + 1)
      );
    } catch {
      // Continue
    }
  }

  console.error(
    "Invalid reschedule AI response:",
    cleaned
  );

  throw new Error(
    "AI returned invalid reschedule JSON"
  );
}

// ==========================================
// Validate AI generated deadlines
// ==========================================

function validateRescheduledTasks(
  value: unknown,
  taskIds: string[],
  today: Date,
  goalDeadline: Date
): RescheduledTask[] {
  let taskList: unknown;

  // ----------------------------------------
  // Extract tasks array
  // ----------------------------------------

  if (
    value &&
    typeof value === "object" &&
    "tasks" in value
  ) {
    taskList = (
      value as {
        tasks: unknown;
      }
    ).tasks;
  }

  if (!Array.isArray(taskList)) {
    throw new Error(
      "AI returned invalid rescheduled task list"
    );
  }

  // ----------------------------------------
  // AI must return exactly same number
  // of tasks
  // ----------------------------------------

  if (taskList.length !== taskIds.length) {
    throw new Error(
      "AI returned incorrect number of rescheduled tasks"
    );
  }

  // ----------------------------------------
  // Track task IDs already returned by AI
  // ----------------------------------------

  const seenTaskIds = new Set<string>();

  // ----------------------------------------
  // Validate every task
  // ----------------------------------------

  const validatedTasks = taskList.map((item) => {
    if (
      !item ||
      typeof item !== "object"
    ) {
      throw new Error(
        "AI returned invalid rescheduled task"
      );
    }

    const {
      taskId,
      deadline,
    } = item as {
      taskId?: unknown;
      deadline?: unknown;
    };

    // --------------------------------------
    // Validate task ID
    // --------------------------------------

    if (
      typeof taskId !== "string" ||
      !taskIds.includes(taskId)
    ) {
      throw new Error(
        "AI returned an invalid task ID"
      );
    }

    // --------------------------------------
    // Prevent duplicate task IDs
    // --------------------------------------

    if (seenTaskIds.has(taskId)) {
      throw new Error(
        "AI returned duplicate task ID"
      );
    }

    seenTaskIds.add(taskId);

    // --------------------------------------
    // Validate deadline
    // --------------------------------------

    if (
      typeof deadline !== "string" ||
      !deadline.trim()
    ) {
      throw new Error(
        "AI returned a task without deadline"
      );
    }

    const parsedDeadline =
      new Date(deadline);

    if (
      isNaN(parsedDeadline.getTime())
    ) {
      throw new Error(
        "AI returned an invalid deadline"
      );
    }

    // --------------------------------------
    // Deadline cannot be before today
    // --------------------------------------

    if (parsedDeadline < today) {
      throw new Error(
        "AI generated a deadline before today"
      );
    }

    // --------------------------------------
    // Deadline cannot exceed goal deadline
    // --------------------------------------

    if (parsedDeadline > goalDeadline) {
      throw new Error(
        "AI generated a deadline after goal deadline"
      );
    }

    return {
      taskId,
      deadline:
        parsedDeadline.toISOString(),
    };
  });

  // ----------------------------------------
  // Make sure every task was returned
  // exactly once
  // ----------------------------------------

  if (seenTaskIds.size !== taskIds.length) {
    throw new Error(
      "AI did not return every remaining task"
    );
  }

  return validatedTasks;
}

// ==========================================
// Regenerate Task Deadlines
// ==========================================

export async function regenerateTaskDeadlines(
  overdueTaskId: string,
  userId: string
): Promise<RescheduledTask[]> {

  // ========================================
  // 1. Find overdue task
  // ========================================

  const overdueTask =
    await Task.findOne({
      _id: overdueTaskId,
      user: userId,
    });

  if (!overdueTask) {
    throw new Error(
      "Task not found"
    );
  }

  // ========================================
  // 2. Completed task cannot regenerate
  // ========================================

  if (
    overdueTask.status === "Completed"
  ) {
    throw new Error(
      "Completed task cannot be regenerated"
    );
  }

  // ========================================
  // 3. Check whether task is overdue
  // ========================================

  const now = new Date();

  if (
    new Date(overdueTask.deadline) >= now
  ) {
    throw new Error(
      "Task is not overdue yet"
    );
  }

  // ========================================
  // 4. Task must belong to a goal
  // ========================================

  if (!overdueTask.goal) {
    throw new Error(
      "This task is not associated with a goal"
    );
  }

  // ========================================
  // 5. Find goal
  // ========================================

  const goal =
    await Goal.findOne({
      _id: overdueTask.goal,
      user: userId,
    });

  if (!goal) {
    throw new Error(
      "Goal not found"
    );
  }

  // ========================================
  // 6. Find all remaining incomplete tasks
  // ========================================

  const remainingTasks =
    await Task.find({
      goal: goal._id,
      user: userId,
      status: {
        $ne: "Completed",
      },
    }).sort({
      deadline: 1,
    });

  if (remainingTasks.length === 0) {
    throw new Error(
      "No remaining tasks to reschedule"
    );
  }

  // ========================================
  // 7. Prepare task data for AI
  // ========================================

  const taskData =
    remainingTasks.map((task) => ({
      taskId: task._id.toString(),

      title: task.title,

      description:
        task.description,

      currentDeadline:
        new Date(task.deadline)
          .toISOString()
          .split("T")[0],

      priority:
        task.priority,

      difficulty:
        task.difficulty,

      estimatedHours:
        task.estimatedHours,
    }));

  // ========================================
  // 8. Prepare dates
  // ========================================

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const targetDate =
    new Date(goal.targetDate)
      .toISOString()
      .split("T")[0];

  // ========================================
  // 9. Create AI prompt
  // ========================================

  const prompt = `
Reschedule the remaining tasks for this goal.

Goal:
${goal.title}

Goal Description:
${goal.description ?? ""}

Today's Date:
${today}

Goal Target Date:
${targetDate}

The user missed an overdue task and wants the remaining
work redistributed realistically.

Remaining Tasks:
${JSON.stringify(taskData, null, 2)}

Rules:

1. Return exactly one object for each remaining task.
2. Every taskId must appear exactly once.
3. Never repeat a taskId.
4. The number of returned tasks must exactly equal the number of remaining tasks.
5. Do not create new tasks.
6. Do not remove tasks.
7. Keep every taskId exactly as provided.
8. Every new deadline must be on or after today.
9. Every new deadline must be on or before the goal target date.
10. Deadlines should progress logically.
11. Earlier tasks should generally receive earlier deadlines.
12. Consider estimated hours and difficulty.
13. Do not change the goal target date.
14. Return deadlines using YYYY-MM-DD format.
15. Return ONLY valid JSON.
16. Do not output reasoning.
17. Do not output thinking.
18. Do not output markdown.
19. Do not output <think> tags.

Return exactly this structure:

{
  "tasks": [
    {
      "taskId": "TASK_ID",
      "deadline": "YYYY-MM-DD"
    }
  ]
}
`;

  // ========================================
  // 10. ONE AI CALL
  // ========================================

  console.log(
    "Regenerating overdue task plan using Groq..."
  );

  const response =
    await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
            "You are a JSON-only task rescheduling assistant. Never output reasoning, explanations, markdown, or thinking tags.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0,

      max_completion_tokens: 1200,
    });

  // ========================================
  // 11. Get AI response
  // ========================================

  const text =
    response.choices[0].message.content ?? "";

  console.log(
    "Raw reschedule AI response:"
  );

  console.log(text);

  // ========================================
  // 12. Parse JSON
  // ========================================

  const parsed =
    extractJson(text);

  // ========================================
  // 13. Validate AI response
  // ========================================

  const validatedTasks =
    validateRescheduledTasks(
      parsed,

      remainingTasks.map((task) =>
        task._id.toString()
      ),

      new Date(today),

      new Date(targetDate)
    );

  // ========================================
  // 14. Return validated tasks
  // ========================================

  return validatedTasks;
}