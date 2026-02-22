import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/role.js";
import { checkApiKey } from "../middlewares/apiKey.js";
import { globalLimiter, sensitiveLimiter } from '../middlewares/rateLimit.js';

import {
    handleCreateResource,
    handleGetResource,
    handleDeleteResource,
    handleUpdateResource,
    handleGenerateApiKey,
    handleExternalAccess
} from "../controllers/resource.js";
import {
    handleAdminCreateResource,
    handleAdminDeleteResource,
    handleAdminUpdateResource,
    handleGetAllResources,
    handleDeleteAllResources
} from "../controllers/adminResource.js";

const router = Router();

router.get("/access", globalLimiter, checkApiKey, handleExternalAccess);

router.post("/", authenticateToken, globalLimiter, handleCreateResource);
router.get("/", authenticateToken, restrictTo("USER"), globalLimiter, handleGetResource);
router.post("/:id/generate-key", authenticateToken, restrictTo("USER"), sensitiveLimiter, handleGenerateApiKey);
router.patch("/:id", authenticateToken, restrictTo("USER"), globalLimiter, handleUpdateResource);
router.delete("/:id", authenticateToken, restrictTo("USER"), globalLimiter, handleDeleteResource);

router.use(authenticateToken, restrictTo("ADMIN"));

router.post("/admin", globalLimiter, handleAdminCreateResource);
router.get("/admin/all", globalLimiter, handleGetAllResources);
router.patch("/admin/:id", globalLimiter, handleAdminUpdateResource);
router.delete("/admin/purge-all", sensitiveLimiter, handleDeleteAllResources);
router.delete("/admin/:id", globalLimiter, handleAdminDeleteResource);

export default router;