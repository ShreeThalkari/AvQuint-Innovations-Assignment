import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateToken } from "../config/jwt.js";
import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name,
    email,
    password: hashedPassword
  });

  const token = generateToken(user._id.toString());
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    }
  });
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password || "");
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id.toString());

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    }
  });
};