import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import  User, { type IUser } from "../models/user";

export interface AuthRequrest extends Request{
    user?: IUser;
}

export const protect = async(
    req: AuthRequrest,
    res: Response,
    next: NextFunction
) => {
    let token;

    //check for token in cookie
    if(req.cookies && req.cookies.token){
        token = req.cookies.token
    }
    if(token){
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = (await User.findById(decoded.userId).select("-password")) as IUser;
            next();
        } catch (error) {
            res.status(401).json({message:"Not authorized, token failed"})
        }
    }else{
        res.status(401).json({message:"Not authorized, no token"})
    }
}