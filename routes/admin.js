import express from "express";
import { updateAdmin, viewAdmins } from "../controllers/admin.js";
import { verifyAdminApiAuthHandler, verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Admin updates any user/ admin fields route
router.put("/update/:id", verifyToken, verifyAdminApiAuthHandler, updateAdmin);

// Admin views all users/ admins route
router.get("/:id", verifyToken, verifyAdminApiAuthHandler, viewAdmins);

export default router;
