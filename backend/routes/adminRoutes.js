import express from "express";
import { addEmployee } from "./authController.js";
import { authenticateToken, authorizeAdmin } from "./authMiddleware.js";

const router = express.Router();

// Admin-only route to add employees
router.post("/admin/add-employee", authenticateToken, authorizeAdmin, addEmployee);

export default router;
