import "dotenv/config";
import { analyzeTask } from "./services/aiService.js";

async function main() {
  console.log("START");
  console.log("BEFORE analyzeTask");

  const result = await analyzeTask(
    "Learn Node.js",
    "Learn Node.js fundamentals for backend development",
    "2026-08-25T00:00:00.000Z"
  );

  console.log("AI RESULT:");
  console.log(result);

  console.log("END");
}

main().catch((error) => {
  console.error("ERROR:", error);
});