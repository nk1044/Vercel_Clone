import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import ProjectRouter from './routes/Project.routes.js'
import UserRouter from './routes/User.routes.js'



const app = express(); 

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.includes('localhost')) return callback(null, true);

        const allowedOrigins = [
            /^https?:\/\/.*\.netlify\.app$/,
            /^https?:\/\/.*\.vercel\.app$/ 
        ];
        if (allowedOrigins.some(regex => regex.test(origin))) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));


app.use('/api/v1/user', UserRouter);
app.use('/api/v1/project', ProjectRouter);
app.get('/api/v1/health-check', (req, res) => res.send('ok'));


export default app;