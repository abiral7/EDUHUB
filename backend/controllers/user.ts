import type { Request, Response } from "express";
import User from "../models/user";
import { generateToken } from "../utils/generateToken";
import { logActivity } from "../utils/activityLog";
import type { AuthRequrest } from "../middleware/auth";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  private Admin Only
export const register = async (req: Request, res: Response):Promise<void> => {
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
            if((req as any).user){
                await logActivity({
                    userId: (req as any).user._id,
                    action: "Registered User",
                    details: `Registered user with email ${newUser.email}`
                })
            }
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

// @desc    Register a new user
// @route   POST /api/users/register
// @access   Public
export const loginUser = async (req: Request, res:Response):Promise<void> => {
    try {
         const {email, password }= req.body;
         const user = await User.findOne({email});
         if(user && await user.matchPassword(password)){
            //generate a token
            generateToken(user.id.toString(),res)
            res.json(user)
         }else{
            res.status(401).json({message:"Invalid email or password"});
         }
    } catch (error) {
        res.status(500).json({message:"Server error",error});
    }
}

// @desc    Update user
// @route   PATCH /api/users/update
// @access   Private Admin Only
export const updateUser = async (req: Request, res:Response):Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
            user.studentClass = req.body.studentClass || user.studentClass;
            user.teacherSubject = req.body.teacherSubject || user.teacherSubject;
            if(req.body.password){
                user.password = req.body.password
            }
            const updatedUser = await user.save();

            res.status(201).json({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.email,
                isActive: updatedUser.isActive,
                studentClass: updatedUser.studentClass,
                teacherSubject: updatedUser.teacherSubject,
                message: "User updated successfully"
            })

            if((req as any).user){
                await logActivity({
                    userId: (req as any).user._id,
                    action: "Update User",
                    details: `Updated user with email ${updatedUser.email}`
                })
            }
        }else {
            res.status(404).json({message:"User not found"})
        }
    } catch (error) {
        res.status(500).json({message:"Server Error", error})
    }
}


// @desc    delete user
// @route   DELETE /api/users/delete
// @access   Private Admin Only
export const deleteUser = async (req: Request, res:Response):Promise<void> => {
    try {
        const user = await User.findById(req.params.id)
        if(user){
            await user.deleteOne()
            if((req as any).user){
                await logActivity({
                    userId: (req as any).user._id,
                    action: "Update User",
                    details: `Deleted user with email ${user.email}`
                })
            }
            res.json({message:"User deleted successfully"})
        }else{
            res.status(404).json({message:"User not found"})
        }
    } catch (error) {
        res.status(500).json({message:"Server Error", error})
    }
}

// @desc    get user
// @route   GET /api/users/all
// @access   Private Admin Only
export const getAllUser = async (req: Request, res:Response):Promise<void> =>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const role = req.query.role as String;
        const search = req.query.search as String;
        const skip = (page -1) * limit;

        //Builder filter object
        const filter: any = {}

        if(role && role !== "all" && role !== ""){
            filter.role = role;
        }

        if(search){
            filter.$or = [
                {name: {$regex: search, $options:"i"}},
                {email: {$regex: search, $options:"i"}}
            ];
        }
        const [total, users] = await Promise.all([
            User.countDocuments(filter),
            User.find(filter)
            .select("-password")
            // .populate("studentClass","_id name section")
            // .populate("teacherSubject","_id name code")
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
        ])
        res.json({
            users,
            pagination:{
                total,
                page,
                pages: Math.ceil(total/limit),
                limit
            }
        })
    } catch (error) {
        res.status(500).json({message:"Server Error", error})
    }
}

// @desc    get user
// @route   GET /api/users/profile
// @access   Private Admin Only
export const getUserProfile = async (req: AuthRequrest, res: Response):Promise<void> =>{
    try {
        if(req.user){
            res.json({
                user: {
                    _id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.email
                }
            })
        }else{
            res.status(401).json({message:"Not authorized"});
        }
    } catch (error) {
        res.status(500).json({message:"Server error", error});
    }
}
// @desc    logout user user
// @route   GET /api/users/logout
// @access   Private Admin Only
export const logout = async (req: AuthRequrest, res: Response):Promise<void> =>{
    try {
        res.cookie("jwt","",{
            httpOnly: true,
            expires: new Date(0)
        });
        res.json({message:"User logged out successfully"});
    } catch (error) {
        res.status(500).json({message:"Server Error", error})
    }
}