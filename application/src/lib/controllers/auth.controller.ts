import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../models/user.model";

const loginUser = async (email: string, name: string, avatar:string) => {
    try {
        if (!email || !name) {
            console.error("Email and name are required for login");
            return null;
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    avatar: existingUser.avatar
            };
        }
        const newUser = await User.create({ email, name });
        return {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar
        };
    } catch (error) {
        console.error("Error logging in user:", error);
        return null;
    }
};

export {
    loginUser,
};
