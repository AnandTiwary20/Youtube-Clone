import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});

  try{
    const { username,email,password } = req.body;

    const existing = await User.findOne({$or:[{email},{username}]});
    if(existing)
      return res.status(400).json({message:existing.email===email?"Email already registered":"Username taken"});

    const user = await User.create({username,email,password});

    const token = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:"7d"});

    res.status(201).json({
      success:true,
      message:"Registration Successful",
      user:{id:user._id,username,email},
      token
    });

  }catch(err){
    res.status(500).json({message:"Server error",error:err.message});
  }
};

export const login = async(req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});

  try{
    const {email,password}=req.body;

    const user=await User.findOne({email});
    if(!user) return res.status(401).json({message:"Invalid credentials"});

    const match=await user.comparePassword(password);
    if(!match) return res.status(401).json({message:"Invalid credentials"});

    const token=jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:"7d"});

    res.json({success:true,token,user:{id:user._id,username:user.username,email}});
  }catch(err){
    res.status(500).json({message:"Server error",error:err.message});
  }
};

export const getUser = async(req,res)=>{
  try{
    const user=await User.findById(req.user._id).select("-password");
    res.json({success:true,user});
  }catch(err){
    res.status(500).json({message:"Server error"});
  }
};
