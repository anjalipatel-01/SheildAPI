import express from "express";

const app = express();
const PORT = 3000;

app.get("/",(req,res)=>{
    res.send("sentinel-core is running");
});

app.listen(PORT,()=>{
    console.log(`server is running on Port: ${PORT}`);
});

