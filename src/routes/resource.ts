import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/role.js";
import { checkApiKey } from "../middlewares/apiKey.js";
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

router.get("/access", checkApiKey, handleExternalAccess);

// USER routes
router.post("/", authenticateToken, handleCreateResource);
router.get("/", authenticateToken, restrictTo("USER"), handleGetResource);
router.post("/:id/generate-key", authenticateToken, restrictTo("USER"), handleGenerateApiKey);
router.patch("/:id", authenticateToken, restrictTo("USER"), handleUpdateResource);
router.delete("/:id", authenticateToken, restrictTo("USER"), handleDeleteResource);

// ADMIN routes
router.use(authenticateToken, restrictTo("ADMIN"));
router.post("/admin", handleAdminCreateResource);
router.get("/admin/all", handleGetAllResources);
router.patch("/admin/:id", handleAdminUpdateResource);
router.delete("/admin/purge-all", handleDeleteAllResources);
router.delete("/admin/:id", handleAdminDeleteResource);

export default router;