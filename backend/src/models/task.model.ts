import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title: { type: String, unique: true },
    description: String,
    status: { type: String, default: "pending" },
    userId: String
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);