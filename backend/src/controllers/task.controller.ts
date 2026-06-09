import { Task } from "../models/task.model.js";
import type { Request, Response } from "express";

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.user;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const { search, status, page = 1, limit = 6 } = req.query;

        const filter: Record<string, unknown> = { userId };
        if (status && status !== "all") filter.status = status;
        if (search) filter.title = { $regex: search, $options: "i" };

        const total = await Task.countDocuments(filter);
        const data = await Task.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        return res.status(200).json({
            data,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const addTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const { title, description } = req.body;

        const task = await Task.create({
            title,
            description,
            status: "pending",
            userId: req.user,
        });

        return res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const editTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const { title, description, status } = req.body;

        const task = await Task.findOne({ _id: req.params.id, userId });

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;

        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const task = await Task.findOne({ _id: req.params.id, userId });

        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne()

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

