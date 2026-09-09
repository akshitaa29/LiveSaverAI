import mongoose, { Schema, Document } from "mongoose";

export interface IFocusSession extends Document {
  user: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;

  startTime: Date;
  endTime?: Date;

  duration?: number;

  completed: boolean;
}

const focusSessionSchema = new Schema<IFocusSession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
    },

    duration: {
      type: Number,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const FocusSession = mongoose.model<IFocusSession>(
  "FocusSession",
  focusSessionSchema
);

export default FocusSession;