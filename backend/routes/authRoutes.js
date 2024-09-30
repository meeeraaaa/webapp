import express from "express";
import { login, validateToken } from "./authController.js";
import { authenticateToken } from "./authMiddleware.js";

const router = express.Router();

// Public login route
router.post("/login", login);

// Token validation route
router.get("/validate", authenticateToken, validateToken);

export default router;
