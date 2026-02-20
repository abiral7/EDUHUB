import express from 'express'
import { loginUser, register } from '../controllers/user'
import { authorize, protect } from '../middleware/auth';

const userRoutes = express.Router()

//make sure to use protect to get the user token
userRoutes.post("/register", protect, authorize(["admin", "teacher"]), register);

userRoutes.post("/login", loginUser);

export default userRoutes;