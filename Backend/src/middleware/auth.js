import jwt from "jsonwebtoken";       //JWT TOKEN VERIFICATION
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";  //A default secret key

//  Auth Middleware logic is here
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader)
      return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User no longer exists" });

    req.user = user;
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ message: "Token expired. Login again." });

    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin check is here where the admin can acces only certain routes 

export const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ message: "Admin access required" });
};


export const isOwner = (Model, ownerField) => async (req, res, next) => {
  try {
    const resource = await Model.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    if (resource[ownerField].toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    req.resource = resource;
    next();

  } catch (err) {
    return res.status(500).json({ message: "Ownership verification error" });
  }
};
