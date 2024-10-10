import express from "express";
import {
  startCourse,
  updateCourseProgress,
  completeCourse,
  getUserCourses,
  getUserProfile,
  getCourseDetails,
  getEmployeeProgress,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.use(authenticateToken);
router.get("/:id/course-progress", getEmployeeProgress);

// Route to start a course
router.post("/start-course", startCourse);

// Route to update course progress
router.put("/update-progress", updateCourseProgress);

// Route to complete a course
router.post("/complete-course", completeCourse);

// Route to get user courses
router.get("/courses", getUserCourses);
router.get("/course/:id", getCourseDetails);
// Route to get user profile
router.get("/profile", getUserProfile);

export default router;
