import type { Request, Response } from "express"
import activitieslogs from "../models/activitieslogs";

// @desc    Ger all activity logs
// @route   GET /api/activity
// @access   Private ADMIN
export const getAllActivities = async (req: Request, res: Response): Promise<void> =>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page -1) * limit;

        const count = await activitieslogs.countDocuments()

        const logs = await activitieslogs.find()
        .populate("user","name email role")// populate user details
        .sort({createdAt: -1})// latest first
        .skip(skip)
        .limit(limit)

        res.json({
            logs,
            page,
            pages: Math.ceil(count / limit),
            total: count
        })
    } catch (error) {
        res.status(500).json({message: "Server Error", error})
    }
}