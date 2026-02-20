import {Router} from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/role.js";
import { handleCreateResource, handleGetResource } from "../controllers/resource.js";

const router = Router();

router.post("/", authenticateToken, handleCreateResource);
router.get("/admin/all", authenticateToken, restrictTo("ADMIN"), handleGetResource);

export default router;