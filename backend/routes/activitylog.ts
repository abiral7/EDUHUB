import express from "express"
import { getAllActivities } from "../controllers/activitiesLog"
import { authorize, protect } from "../middleware/auth"

const activityRouter = express.Router()

activityRouter.get("/", protect, authorize(["admin"]), getAllActivities)

export default activityRouter