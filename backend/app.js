import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js'
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import projectRoutes from './routes/project.routes.js';
import aiRoutes from './routes/ai.routes.js';
import aiReviewRoutes from './routes/aiReview.routes.js';
connect();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/users',userRoutes);
app.use('/projects',projectRoutes);
app.use('/ai',aiRoutes);
app.use('/ai-review', aiReviewRoutes);



app.get('/',(req,res)=>{
    res.send('Helllo world!!');
})

export default app;