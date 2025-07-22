import mongoose, { models, Schema, model } from "mongoose";

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        default: "https://www.gravatar.com/avatar/0000000000000000000000000000000?d=mp&f=y",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    Projects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ]
});

export interface IUser {
    name: string;
    email: string;
    avatar: string;
    createdAt: Date;
    Projects: mongoose.Types.ObjectId[];
}

if(process.env.MODE === "development") {
    if (models.User) {
        delete models.User;
    }
}

export const User = model("User", userSchema);