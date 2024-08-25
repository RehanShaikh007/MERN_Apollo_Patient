import express from "express";

import {config} from "dotenv"  

import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import messageRouter from "./router/messageRouter.js"
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import path from "path"


const app = express();

config({path: "./config/config.env"})

const allowedOrigins = ['http://localhost:5175', 'https://mern-apollo-patient.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);



dbConnection();

const __dirname = path.resolve();

app.use(errorMiddleware);

app.use(express.static(path.join(__dirname, '/Frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'dist', 'index.html'));
})

export default app;
