import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// AUTH MIDDLEWARE
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);

    
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Optional admin middleware 
export const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") next();
  else res.status(403).json({ message: "Admin access required" });
};

// Universal ownership check 
export const isOwner = (model, ownerField) => async (req, res, next) => {
  try {
    const resource = await model.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    if (resource[ownerField].toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    req.resource = resource;
    next();
  } catch (err) {
    res.status(500).json({ message: "Ownership verification error" });
  }
};
