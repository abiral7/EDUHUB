import mongoose, { Schema, type Document } from "mongoose";

export interface IActivityLog extends Document {
    user: string;
    action: string;
    details?: string;
    createdAt: Date;
}

const activitiesLogSchema = new Schema({
    user: {type:Schema.Types.ObjectId, require:true, ref:"User"},
    action: {type:String, require:true},
    details: {type:String, default:null}
},{
    timestamps: true
});

export default mongoose.model<IActivityLog>(
    "ActivityLog",
    activitiesLogSchema
)