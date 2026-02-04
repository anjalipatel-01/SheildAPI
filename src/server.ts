import express from "express";
import  router  from "./routes/auth.js";
import {globalErrorHandler} from "./middlewares/error.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(globalErrorHandler);
app.use("/api",router);
app.get("/",(req,res)=>{
    res.send("sentinel-core is running");
});

app.listen(PORT,()=>{
    console.log(`server is running on Port: ${PORT}`);
});

