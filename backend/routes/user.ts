import express from 'express'
import { deleteUser, getAllUser, loginUser, register, updateUser } from '../controllers/user'
import { authorize, protect } from '../middleware/auth';

const userRoutes = express.Router()

//make sure to use protect to get the user token
userRoutes.post("/register", protect, authorize(["admin", "teacher"]), register);
userRoutes.post("/login", loginUser);
userRoutes.delete("/delete/:id", protect, authorize(["admin", "teacher"]), deleteUser);
userRoutes.patch("/update/:id", protect, authorize(["admin", "teacher"]), updateUser);
userRoutes.get("/all", protect, authorize(["admin", "teacher"]), getAllUser);

export default userRoutes;