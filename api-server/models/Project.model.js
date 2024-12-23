import mongoose, {model, Schema} from "mongoose";

const ProjectSchema = new Schema({
    URL: {
        type: String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
    },
    Owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: "Pending"
    }
}, {timestamps: true});

// status = ["Pending", "Downloading", "Building", "Deploying", "Completed", "Failed"]

export const Project = model("Project", ProjectSchema);

ProjectSchema.methods.UpdateStatus = async function(status){
    this.status = status;
    await this.save({validateBeforeSave: false});
    return this;
}