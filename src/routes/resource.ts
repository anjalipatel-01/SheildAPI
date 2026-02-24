import { Router } from "express";
import { authenticateToken, validate } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/role.js";
import { checkApiKey } from "../middlewares/apiKey.js";
import { globalLimiter, sensitiveLimiter } from '../middlewares/rateLimit.js';
import { validateCache } from "../middlewares/cache.js";
import {
    UUIDParam, CreateResourceSchema, UpdateResourceSchema, AdminCreateResourceSchema, AdminUpdateResourceSchema
} from "../schemas/resource.js";

import {
    handleCreateResource, handleGetResource, handleDeleteResource, handleUpdateResource, handleGenerateApiKey, handleExternalAccess
} from "../controllers/resource.js";
import {
    handleAdminCreateResource, handleAdminDeleteResource, handleAdminUpdateResource, handleGetAllResources, handleDeleteAllResources, handleGetAuditLogs
} from "../controllers/adminResource.js";

const router = Router();

router.get("/access", globalLimiter, checkApiKey, handleExternalAccess);

router.post("/", authenticateToken, globalLimiter, validate(CreateResourceSchema), handleCreateResource);
router.get("/", authenticateToken, restrictTo("USER"), globalLimiter, validateCache, handleGetResource);
router.post("/:id/generate-key", authenticateToken, restrictTo("USER"), sensitiveLimiter, validate(undefined, UUIDParam), handleGenerateApiKey);
router.patch("/:id", authenticateToken, restrictTo("USER"), globalLimiter, validate(UpdateResourceSchema, UUIDParam), handleUpdateResource);
router.delete("/:id", authenticateToken, restrictTo("USER"), globalLimiter, validate(undefined, UUIDParam), handleDeleteResource);

router.use(authenticateToken, restrictTo("ADMIN"));

router.post("/admin", globalLimiter, validate(AdminCreateResourceSchema), handleAdminCreateResource);
router.get("/admin/all", globalLimiter, handleGetAllResources);
router.patch("/admin/:id", globalLimiter, validate(AdminUpdateResourceSchema, UUIDParam), handleAdminUpdateResource);
router.delete("/admin/purge-all", sensitiveLimiter, handleDeleteAllResources);
router.delete("/admin/:id", globalLimiter, validate(undefined, UUIDParam), handleAdminDeleteResource);
router.get("/admin/logs", globalLimiter, handleGetAuditLogs);

export default router;