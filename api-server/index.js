import 'dotenv/config'
import connectDB from './db/db.js';
import app from './app.js';



connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("Error: server connection failed in db/db.js :  ", error);
        throw error;
    })
    app.listen(process.env.PORT, ()=>{
        console.log(`V2 server is listening on port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("mongodb connection failed", err);
});



