import express from "express";
import { login } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleWare.js";

const router = express.Router();

// Public login route
router.post("/login", login);

// Token validation route
//router.get("/validate", authenticateToken, validate);

export default router;
