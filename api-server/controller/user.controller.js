import jwt from "jsonwebtoken";
import { User } from '../models/User.model.js';


const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
}


const GenerateToken = async(userId) => {
    const user = await User.findById(userId);
    const AccessToken = await user.GenerateAccessToken();
    const RefreshToken = await user.GenerateRefreshToken();

    user.refreshToken = RefreshToken;
    await user.save({validateBeforeSave: false});

    return {AccessToken, RefreshToken};
}


const RegisterUser = async (req, res) => {

    //get data from request
    //validate data
    //check if user already exists
    //create user
    //return user
    console.log("a user connected");
    
    const {username, email, password} = req.body;

    if([username, email, password].some(field => field?.trim() === "")){
        return res.status(400).json({message: "Please fill all fields"});
    }

    const userExists = await User.findOne({email});

    if(userExists){
        return res.status(400).json({message: "User already exists"});
    }

    const user = await User.create({username, email, password});

    const {AccessToken, RefreshToken} =  await GenerateToken(user._id);

    const CreatedUser = await User.findById(user._id).select("-password -refreshToken");

    if(!CreatedUser){
        return res.status(500).json({message: "User not created"});
    }

    return res.status(201)
    .cookie("refreshToken", RefreshToken, options)
    .cookie("accessToken", AccessToken, options)
    .json({message: "User created successfully", user: CreatedUser});
    
}

const LoginUser = async (req, res) => {
    //get data from request
    //validate data
    //check if user exists
    //check if password is correct
    //generate token
    //return user
    console.log("a user connected");
    const {email, password} = req.body;

    if([email, password].some(field => field?.trim() === "")){
        return res.status(400).json({message: "Please fill all fields"});
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).json({message: "User not found"});
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        return res.status(400).json({message: "Invalid credentials"});
    }

    const {AccessToken, RefreshToken} =  await GenerateToken(user._id);

    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken");

    if(!LoggedInUser){
        return res.status(500)
        .json({message: "User not found"});
    }


    return res.status(200)
    .cookie("refreshToken", RefreshToken, options)
    .cookie("accessToken", AccessToken, options)
    .json({message: "User logged in successfully", user: LoggedInUser});

}

const GetCurrentUser = async (req, res) => {
    return res.status(200).json({user: req.user});
}

const LogOut = async (req, res) => {
    
    await User.findByIdAndUpdate(
        req.user._id, 
        {refreshToken: ""}, 
        {new: true}
    );

    return res.status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json({message: "User logged out successfully"});

}

const UpdateTokens = async(req, res)=>{
    const Token = req.cookies.refreshToken || req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(Token, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({message: "User not found"});
        }
        if(user.refreshToken !== Token){
            res.status(401).json({message: "Unauthorized"});
        }
        req.user = user;
    } catch (error) {
        res.status(401).json({message: "Unauthorized"});
    }

    const user = await User.findById(req.user._id);

    const accessToken = user.GenerateAccessToken();
    const refreshToken = user.GenerateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});
    
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({message: "Tokens updated successfully"});
}


export { 
    LoginUser,
    RegisterUser,
    GetCurrentUser,
    LogOut,
    UpdateTokens
 };