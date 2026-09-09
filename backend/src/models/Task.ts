import mongoose, { Schema, Document } from "mongoose";
import { Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;

  deadline: Date;

  priority: string;
  status: string;

  taskType: string;
  reminderTime?: Date;
  reminderSent?: boolean;

  user: mongoose.Types.ObjectId;

  difficulty: string;
  goal?: Types.ObjectId;
  estimatedHours: number;
  riskScore: number;
  aiRecommendation: string;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    taskType: {
    type: String,
     enum: ["Action", "Reminder"],
    default: "Action",
    },

    reminderTime: {
      type: Date,
    },

    reminderSent: {
      type: Boolean,
      default: false,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    
},
    goal: {
    type: Schema.Types.ObjectId,
    ref: "Goal",
},

    estimatedHours: {
      type: Number,
    },

    riskScore: {
      type: Number,
    },

    aiRecommendation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;