import Groq from "groq-sdk";
// console.log("Groq Key:", process.env.GROQ_API_KEY);
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface AIAnalysis {
  taskType?: "Action" | "Reminder";

  priority?: "Low" | "Medium" | "High";

  difficulty?: "Easy" | "Medium" | "Hard";

  estimatedHours?: number;

  riskScore?: number;

  recommendation?: string;

  reminderTime?: string;
}
export async function analyzeTask(
  title: string,
  description: string,
  deadline: string
): Promise<AIAnalysis> {
  console.log("analyzeTask called");
const prompt = `
You are an AI productivity assistant.

Analyze the user's task and determine how it should be handled.

TASK TITLE:
${title}

TASK DESCRIPTION:
${description}

DEADLINE:
${deadline}

-----------------------------------

STEP 1: Determine task type.

There are only two types:

1. Action
2. Reminder

ACTION:
Requires actual work or focused time.

Examples:
- Learn React
- Update Resume
- Complete Assignment
- Build a Project
- Practice DSA

REMINDER:
Only requires the user to remember or attend something.
It does not require a significant work session.

Examples:
- Pay electricity bill
- Attend doctor's appointment
- Call someone
- Submit a simple form
- Attend a meeting

-----------------------------------

STEP 2: Determine priority.

Priority must be one of:

Low
Medium
High

Consider:

- How close the deadline is
- Importance of the task
- Consequences of missing it
- Amount of work required
- Whether the task is part of an important objective

Do NOT automatically make every task High priority.

-----------------------------------

IF TASK TYPE = ACTION

Also determine:

difficulty:
Easy | Medium | Hard

estimatedHours:
Realistic number of hours required to complete the task.

riskScore:
Number from 0 to 100 representing the likelihood of missing the deadline.

recommendation:
A short useful recommendation for completing the task.

Return:

{
  "taskType": "Action",
  "priority": "Low | Medium | High",
  "difficulty": "Easy | Medium | Hard",
  "estimatedHours": 0,
  "riskScore": 0,
  "recommendation": ""
}

-----------------------------------

IF TASK TYPE = REMINDER

Return:

{
  "taskType": "Reminder",
  "priority": "Low | Medium | High",
  "reminderTime": "${deadline}"
}

-----------------------------------

IMPORTANT:

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations outside the JSON.
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });
  console.log("Groq response received");

  const text = response.choices[0].message.content ?? "";

 const cleaned = text
  .replace(/<think>[\s\S]*?<\/think>/gi, "")
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleaned);
}

export default groq;