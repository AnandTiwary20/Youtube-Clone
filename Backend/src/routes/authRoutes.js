import express from "express";
import { register, login, getUser } from "../controllers/authController.js";
import { authenticate as auth } from "../middleware/auth.js";
import { check } from "express-validator";

const router=express.Router();

// VALIDATORS
const registerRules=[
  check("username").notEmpty(),
  check("email").isEmail(),
  check("password").isLength({min:6})
];

const loginRules=[
  check("email").isEmail(),
  check("password").exists()
];

// ROUTES
router.post("/register",registerRules,register);
router.post("/login",loginRules,login);
router.get("/user",auth,getUser);

export default router;
