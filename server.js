//packages input
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bcrypt from "bcrypt";
import 'express-async-errors';
//file inputs
import db from "./config/db.js";
//importing routes
import authroutes from "./routes/authroutes.js";
import routes from "./routes/routes.js";
import userRoutes from "./routes/userRoutes.js"
import errorhandler from "./middlewares/errorhandler.js";


dotenv.config();



const app = express();
const port = 3000;

//middleware
app.use(express.urlencoded());
app.use(cors());
app.use(morgan('dev'));

//routes
app.use("/api/v1/test", routes);
app.use("/api/v1/auth", authroutes);
app.use("/api/v1/user", userRoutes);
//validation middleware
app.use(errorhandler)


app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})