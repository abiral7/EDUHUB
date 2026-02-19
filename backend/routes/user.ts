import express from 'express'
import { loginUser, register } from '../controllers/user'

const userRoutes = express.Router()

userRoutes.post("/register", register);

userRoutes.post("/login", loginUser);

export default userRoutes;