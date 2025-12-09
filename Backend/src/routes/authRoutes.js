import express from "express";
import { register, login, getUser } from "../controllers/authController.js";
import { authenticate as auth } from "../middleware/auth.js";
import { check } from "express-validator";

const router = express.Router();

// VALIDATION RULES
const registerRules = [
  check("username", "Username is required").notEmpty(),
  check("email", "Valid email is required").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
];

const loginRules = [
  check("email", "Valid email is required").isEmail(),
  check("password", "Password is required").exists(),
];

// ROUTES
router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.get("/user", auth, getUser);

export default router;
