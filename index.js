import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { productRoute, categoryRoute, cartRoute, authRoute } from './routes/index.js';

dotenv.config();
const app = express();

app.use(cookieParser())
app.use(express.json({
    limit: '50mb'
}));
app.use(cors());
app.use(helmet());

//Connect to DB
const connection = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(`${process.env.MONGO_URI}`)
            .then(() => console.log('MongoDB connected'))
            .catch((err) => console.log(err));
    } catch (error) {
        console.log(error);
    }
}

//Routes

app.use('/api/auth', authRoute);
app.use('/api/cart', cartRoute);
app.use('/api/products', productRoute);
app.use('/api/category', categoryRoute);


//Middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    return res.status(status).json({
        success: false,
        message,
        status
    });
})

const port = process.env.PORT;

//Listen to server
app.listen(port, () => {
    connection();
    console.log(`Server is running ${port}`)
});
