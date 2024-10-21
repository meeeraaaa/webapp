//C:\Users\AnanyaSarkar\Documents\project\webapp\backend\routes\adminRoutes.js
import express from "express";
import {
  addEmployee,
  getEmployees,
  getEmployeeCourses,
  getEmployeeProgress,
  getCourseCompletionByDesignation,
  getSkillsByDesignation,
  getCourseDifficultyDistribution 
} from '../controllers/adminController.js';

import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleWare.js";
import { addCourse, assignCourseToEmployee, getCourses, getSkills, updateCourse,getAssignedEmployees,getCourseById
} from "../controllers/courseController.js";
import { getDesignations } from '../controllers/designationController.js';
const router = express.Router();

router.post("/add-employee", addEmployee);
//router.post("/add-employee", authenticateToken, authorizeAdmin, addEmployee);
router.get("/employees", getEmployees);
router.get("/course/:courseId/completion-status", getCourseCompletionByDesignation);

// Courses
router.get('/skills', authenticateToken, authorizeAdmin, getSkills);
router.get("/courses", authenticateToken, authorizeAdmin, getCourses);
router.post("/add-course", authenticateToken, authorizeAdmin, addCourse);
router.post("/assign-course", authenticateToken, authorizeAdmin, assignCourseToEmployee);
router.put("/update-course/:id", authenticateToken, authorizeAdmin, updateCourse);
router.get("/courses/:courseId/employees",getAssignedEmployees);
router.get('/course/:id', getCourseById);
router.get("/skills/:skillId/designations",getSkillsByDesignation);

router.get('/designations', getDesignations, authorizeAdmin);
//add employee detail route.
router.get('/employees/:id/courses', getEmployeeCourses, authorizeAdmin);
router.get('/employees/:id/progress', getEmployeeProgress, authorizeAdmin); 
router.get('/courses/difficulty-distribution',getCourseDifficultyDistribution,authorizeAdmin)

export default router;
