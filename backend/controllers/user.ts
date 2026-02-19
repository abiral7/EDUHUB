import type { Request, Response } from "express";
import User from "../models/user";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  public
export const registerUser = async (req: Request, res: Response):Promise<void> => {
    try {
        const {
            name, email, password, role, studentClass, teacherSubject, isActive
        } = req.body;

        // check if user exists
        const existingUser = await User.findOne({email});

        if(existingUser){
            res.status(400).json({message:"User already exists"});
            return;
        }

        //Create user
        const newUser = await User.create({
            name,
            email,
            password,
            role,
            studentClass,
            teacherSubject,
            isActive
        })

        if(newUser){
            res.status(201).json({
                _id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.email,
                studentClass: newUser.studentClass,
                teacherSubject: newUser.teacherSubject,
                message: "User registered successfully"
            })
        }else{
            res.status(400).json({message:"Invalid user data"})
        }
    } catch (error) {
        res.status(500).json({message: "Server Error", error});
    }
}