import {Router} from "express";
import {validate} from "../middlewares/auth.js";
import {RegisterSchema,LoginSchema} from "../schemas/auth.js";
import { handleRegister,handleLogin } from "../controllers/auth.js";
const router = Router();

router.post("/register",
    validate(RegisterSchema),
    handleRegister
);
router.post("/login",
    validate(LoginSchema),
    handleLogin
);
export default router;