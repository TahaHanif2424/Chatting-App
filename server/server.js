import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './src/routes/routes.js';

const app=express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5713"
}))

app.use('/user',router)
app.listen(5000,()=>{
    console.log("listening at port " ,5000)
})