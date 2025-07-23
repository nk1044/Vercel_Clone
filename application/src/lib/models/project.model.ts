import {model, models, Schema} from "mongoose";

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
        default: "Pending",
        enum: ["Pending", "Downloading", "Building", "Deploying", "Completed", "Failed"]
    }
}, {timestamps: true});

if(process.env.MODE === "development") {
    if (models.Project) {
        delete models.Project;
    }
}

export const Project = model("Project", ProjectSchema);

ProjectSchema.methods.UpdateStatus = async function(status: string) {
    this.status = status;
    await this.save({validateBeforeSave: false});
    return this;
}