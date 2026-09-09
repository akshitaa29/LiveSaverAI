import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
import {
  startNotificationScheduler,
} from "./services/notificationService.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );

    startNotificationScheduler();
  });
};

startServer();