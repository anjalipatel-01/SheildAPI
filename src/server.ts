import express from "express";
import authRouter from "./routes/auth.js";
import resourceRouter from "./routes/resource.js";
import { globalErrorHandler } from "./middlewares/error.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("sentinel-core is running");
});

app.use("/api/auth", authRouter);
app.use("/api/resources", resourceRouter);

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`server is running on Port: ${PORT}`);
});
