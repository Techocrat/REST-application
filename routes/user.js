import express from "express";
import { update, view } from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// User updates any user fields route
router.put("/update/:id", verifyToken, update);

// User views all users route
router.get("/:id", verifyToken, view);

export default router;
