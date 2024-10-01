//C:\Users\AnanyaSarkar\Documents\project\webapp\backend\routes\adminRoutes.js
import express from "express";
import { addEmployee } from "../controllers/adminController.js";
//import { authenticateToken, authorizeAdmin } from "./authMiddleware.js";

const router = express.Router();

// Admin-only route to add employees
router.post("/add-employee", addEmployee);
//router.post("/add-employee", authenticateToken, authorizeAdmin, addEmployee);
router.get("/employees", getEmployees);

export default router;
