const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    role: {
      type: String,
      default: "pending",
      enum: ["pending", "working", "review", "done", "archive"],
      required: true,
    },
    isDeleted: { type: Boolean, default: false, required: true },
    assignedTo: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
//Create and export model

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
