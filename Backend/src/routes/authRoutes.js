import express from "express";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { authenticate as auth } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// REGISTER
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
      // check if user exists
      let existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      // generate token
      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      });

    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// LOGIN
router.post(
  "/login",
  [
    check("email", "Valid email required").isEmail(),
    check("password", "Password required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).send("Server error");
    }
  }
);

// GET LOGGED IN USER
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    return res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).send("Server error");
  }
});

export default router;
