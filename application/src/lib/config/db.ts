import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGO_DB}`)
        console.log(`Mongodb connected: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("mongodb connection error/connection failed!! in src/db/index.js : ", error);
        process.exit(1);
    }
}
export {
    connectDB,
};