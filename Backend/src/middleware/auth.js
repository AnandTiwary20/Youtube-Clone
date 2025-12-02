import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user from payload
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Middleware to check if user is the owner of the resource
export const isOwner = (model) => async (req, res, next) => {
  try {
    const resource = await model.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the user is the owner of the resource
    if (resource.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    req.resource = resource;
    next();
  } catch (error) {
    console.error('Ownership check error:', error);
    res.status(500).json({ message: 'Server error during ownership verification' });
  }
};
