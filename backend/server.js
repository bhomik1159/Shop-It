import path from 'path';
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import {notFound,errorHandler} from "./middleware/errorHandle.js";
import productsRoutes from "./routes/productsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/oderRoutes.js";
import uploadRoute from './routes/uploadRoute.js';
const port = process.env.PORT;
const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/products',productsRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/upload',uploadRoute);
app.get('/api/config/paypal',(req,res)=>{
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID});
});
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname,'/uploads')));
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname,'/frontend/build')));

    app.get('*',(req,res)=>
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html')))
}else{
    app.get('/',(req,res)=>{
        res.send("api is running.....");
    });
}
app.use(notFound);
app.use(errorHandler);

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
});