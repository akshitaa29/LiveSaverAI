import mongoose, { Document, Schema } from "mongoose";

export interface IGoal extends Document {
  title: string;
  description?: string;
  targetDate: Date;
  category: string;
  progress: number;
  status: string;
  user: mongoose.Types.ObjectId;
}
const goalSchema = new Schema(
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

    targetDate: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      required: false,
      enum: [
        "Career",
        "Study",
        "Health",
        "Fitness",
        "Finance",
        "Personal",
        "Other",
      ],
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      default: "Not Started",
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
      ],
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Goal = mongoose.model<IGoal>("Goal", goalSchema);

export default Goal;