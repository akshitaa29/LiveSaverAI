import groq from "./aiService.js";

export interface GoalTask {
  order: number;
  title: string;
  description: string;
  deadline: string;
  priority: "Low" | "Medium" | "High";
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedHours: number;
  riskScore: number;
  aiRecommendation: string;
}

function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue
  }

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

  const arrayStart = cleaned.indexOf("[");
  const arrayEnd = cleaned.lastIndexOf("]");

  if (
    arrayStart !== -1 &&
    arrayEnd !== -1 &&
    arrayEnd > arrayStart
  ) {
    try {
      return JSON.parse(
        cleaned.slice(arrayStart, arrayEnd + 1)
      );
    } catch {
      // Continue
    }
  }

  console.error("Invalid AI JSON response:", cleaned);

  throw new Error(
    "AI returned invalid JSON for goal tasks"
  );
}

function validateGoalTasks(
  value: unknown
): GoalTask[] {
  let taskList: unknown;

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
  } else if (Array.isArray(value)) {
    taskList = value;
  }

  if (
    !Array.isArray(taskList) ||
    taskList.length < 5 ||
    taskList.length > 12
  ) {
    throw new Error(
      "AI returned an invalid goal task list"
    );
  }

  return taskList.map((task, index) => {
    if (
      !task ||
      typeof task !== "object"
    ) {
      throw new Error(
        "AI returned an invalid goal task"
      );
    }

    const {
      title,
      description,
      deadline,
      priority,
      difficulty,
      estimatedHours,
      riskScore,
      aiRecommendation,
    } = task as {
      title?: unknown;
      description?: unknown;
      deadline?: unknown;
      priority?: unknown;
      difficulty?: unknown;
      estimatedHours?: unknown;
      riskScore?: unknown;
      aiRecommendation?: unknown;
    };

    if (
      typeof title !== "string" ||
      title.trim().length === 0
    ) {
      throw new Error(
        "AI returned a goal task without a title"
      );
    }

    if (
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      throw new Error(
        "AI returned a goal task without a description"
      );
    }

    if (
      typeof deadline !== "string" ||
      deadline.trim().length === 0
    ) {
      throw new Error(
        "AI returned a goal task without a deadline"
      );
    }

    const parsedDeadline = new Date(deadline);

    if (isNaN(parsedDeadline.getTime())) {
      throw new Error(
        "AI returned an invalid task deadline"
      );
    }

    if (
      priority !== "Low" &&
      priority !== "Medium" &&
      priority !== "High"
    ) {
      throw new Error(
        "AI returned an invalid task priority"
      );
    }

    if (
      difficulty !== "Easy" &&
      difficulty !== "Medium" &&
      difficulty !== "Hard"
    ) {
      throw new Error(
        "AI returned an invalid task difficulty"
      );
    }

    if (
      typeof estimatedHours !== "number" ||
      estimatedHours <= 0
    ) {
      throw new Error(
        "AI returned an invalid estimated hours value"
      );
    }

    if (
      typeof riskScore !== "number" ||
      riskScore < 0 ||
      riskScore > 100
    ) {
      throw new Error(
        "AI returned an invalid risk score"
      );
    }

    if (
      typeof aiRecommendation !== "string" ||
      aiRecommendation.trim().length === 0
    ) {
      throw new Error(
        "AI returned a task without recommendation"
      );
    }

    return {
      order: index + 1,
      title: title.trim(),
      description: description.trim(),
      deadline: parsedDeadline.toISOString(),
      priority,
      difficulty,
      estimatedHours,
      riskScore,
      aiRecommendation:
        aiRecommendation.trim(),
    };
  });
}

export async function generateGoalTasks(
  title: string,
  description: string,
  targetDate: string
): Promise<GoalTask[]> {
  const prompt = `
Create a sequential roadmap for the following goal.

Goal:
${title}

Description:
${description}

Goal Target Date:
${targetDate}

Today's Date:
${new Date().toISOString().split("T")[0]}

Generate exactly 6 actionable sequential tasks.

For EVERY task generate:

- title
- description
- deadline
- priority
- difficulty
- estimatedHours
- riskScore
- aiRecommendation

Deadline rules:

1. Every task deadline must be on or after today's date.
2. Every task deadline must be on or before the goal target date.
3. Deadlines should progress logically.
4. The final task deadline must not exceed the goal target date.
5. Use ISO date format: YYYY-MM-DD.

Rules:

- Title maximum 8 words.
- Description maximum 12 words.
- priority must be Low, Medium, or High.
- difficulty must be Easy, Medium, or Hard.
- estimatedHours must be a positive number.
- riskScore must be between 0 and 100.
- aiRecommendation must be actionable.
- Tasks must be sequential.
- Do not generate IDs.
- Do not generate status.
- Do not generate extra fields.

Return ONLY valid JSON.

Do NOT output:
- thinking
- reasoning
- explanations
- markdown
- <think> tags

Return exactly this structure:

{
  "tasks": [
    {
      "title": "Master core data structures",
      "description": "Study arrays, linked lists, stacks, queues, and trees.",
      "deadline": "2026-08-23",
      "priority": "Medium",
      "difficulty": "Medium",
      "estimatedHours": 20,
      "riskScore": 15,
      "aiRecommendation": "Practice each structure with coding exercises."
    }
  ]
}
`;

  console.log(
    "Generating complete goal roadmap using Groq..."
  );

const response = await groq.chat.completions.create({
  model: "openai/gpt-oss-20b",

  messages: [
    {
      role: "system",
      content:
        "Return ONLY valid JSON. Do not output reasoning, analysis, markdown, or <think> tags.",
    },
    {
      role: "user",
      content: prompt,
    },
  ],

  temperature: 0,

  max_completion_tokens: 2500,

  response_format: {
    type: "json_object",
  },
});

  console.log(
    "Groq complete goal roadmap received"
  );

  const text =
    response.choices[0].message.content ?? "";

  console.log(
    "Raw goal AI response:"
  );

  console.log(text);

  const parsed = extractJson(text);

  return validateGoalTasks(parsed);
}