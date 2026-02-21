import {Router} from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/role.js";
import { 
    handleCreateResource,
    handleGetResource,
    handleDeleteResource, 
    handleUpdateResource
} from "../controllers/resource.js";
import {
    handleAdminCreateResource,
    handleAdminDeleteResource,
    handleAdminUpdateResource,
    handleGetAllResources,
    handleDeleteAllResources 
} from "../controllers/adminResource.js";

const router = Router();
//USER
//Create
router.post("/", authenticateToken, handleCreateResource); 
//View
router.get("/:id", authenticateToken, restrictTo("USER"), handleGetResource); 
//Edit
router.patch("/:id", authenticateToken, restrictTo("USER"), handleUpdateResource);
//Delete
router.delete("/id:", authenticateToken, restrictTo("USER"), handleDeleteResource); 

//ADMIN
router.use(authenticateToken, restrictTo("ADMIN"));
//create
router.post("/admin/:id", authenticateToken, handleAdminCreateResource);
// view
router.get("/admin/all", authenticateToken, handleGetAllResources); 
//update
router.patch("/admin/:id", handleAdminUpdateResource);
//delete single resource
router.delete("/admin/:id", handleAdminDeleteResource);
router.delete("/admin/purge-all", handleDeleteAllResources);
export default router;