import dotenv from "dotenv";
dotenv.config()

import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.middleware.js"
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js"


await connectDB();

const app = express()
app.use(cors({ origin: `${process.env.BASE_URL}` }));
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('http://localhost:5000');
});