import activitieslogs from "../models/activitieslogs"


export const logActivity = async({
    userId,
    action,
    details
}:{
    userId: string,
    action: string,
    details?: string}
) =>{
    try {
        await activitieslogs.create({
            user: userId,
            action: action,
            details: details
        })
    } catch (error) {
        console.log("Server Error", error)
    }
}