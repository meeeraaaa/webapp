//C:\Users\AnanyaSarkar\Documents\project\webapp\backend\routes\adminRoutes.js
import express from "express";
import {
    addEmployee,
    getEmployees,
    addCourse,
    updateCourse,
    //assignCourseToEmployee
    getCourses
  } from '../controllers/adminController.js';
  //import { authenticateToken, authorizeAdmin } from "./authMiddleware.js";

const router = express.Router();

// Admin-only route to add employees
router.post("/add-employee", addEmployee);
//router.post("/add-employee", authenticateToken, authorizeAdmin, addEmployee);
router.get("/employees", getEmployees);
// Admin routes for managing courses
router.post("/add-course", addCourse);
router.put("/update-course/:id", updateCourse);
router.get("/courses",  getCourses);
// router.post("/assign-course", assignCourseToEmployee);
export default router;
