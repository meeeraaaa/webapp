//C:\Users\AnanyaSarkar\Documents\project\webapp\backend\routes\adminRoutes.js
import express from "express";
import {
  addEmployee,
  getEmployees,
  getEmployeeCourses
} from '../controllers/adminController.js';

import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleWare.js";
import { addCourse, assignCourseToEmployee, getCourses, getSkills, updateCourse,getAssignedEmployees
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/add-employee", addEmployee);
//router.post("/add-employee", authenticateToken, authorizeAdmin, addEmployee);
router.get("/employees", getEmployees);


// Courses
router.get('/skills', authenticateToken, authorizeAdmin, getSkills);
router.get("/courses", authenticateToken, authorizeAdmin, getCourses);
router.post("/add-course", authenticateToken, authorizeAdmin, addCourse);
router.post("/assign-course", authenticateToken, authorizeAdmin, assignCourseToEmployee);
router.put("/update-course/:id", authenticateToken, authorizeAdmin, updateCourse);
router.get("/courses/:courseId/employees",getAssignedEmployees);

//add employee detail route.
router.get('/employees/:id/courses', getEmployeeCourses);
export default router;
