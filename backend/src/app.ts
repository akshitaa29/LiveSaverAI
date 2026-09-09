import express from "express";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import focusRoutes from "./routes/focusRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/focus", focusRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;