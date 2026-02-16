import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, {type Application,type Request,type Response} from "express";
import helmet from "helmet";
import morgan from "morgan";

//Load environment variables from .env file
dotenv.config();

const app:Application = express();
const PORT= process.env.PORT || 5000;

//add security middleware/headers + make sure listen on *root file* for changes
app.use(helmet()) //Security middleware to set various HTTP headers for app security
app.use(express.json()); //Middleware to parse JSON bodies
app.use(express.urlencoded({extended:true})); // Middleware to parse URL-encoed bodies
app.use(cookieParser()); //Middleware to parse cookies

//Log HTTP request to console
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}

app.listen(PORT,() =>{
    console.log("Running server at 3000");
})