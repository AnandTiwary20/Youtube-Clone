import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// REGISTER The user logic is here
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    
    const user = await User.create({
      username,
      email,
      password,  
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.log("Registration Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


// LOGIN for the existing user is here
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET USER to fetch logged in user details
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};
