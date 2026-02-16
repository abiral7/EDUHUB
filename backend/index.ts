import express, {Application, Request, Response} from "express";

const app:Application = express();
const PORT= process.env.PORT || 5000;

app.listen(PORT,() =>{
    console.log("Running server at 3000");
})