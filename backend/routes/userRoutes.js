import express from "express";
import {
    startCourse, 
    updateCourseProgress, 
    completeCourse,
    getUserCourses,
    getUserProfile
} from '../controllers/userController.js';
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.use(authenticateToken);


// Route to start a course
router.post('/start-course', startCourse);

// Route to update course progress
router.put('/update-progress', updateCourseProgress);

// Route to complete a course
router.post('/complete-course', completeCourse);

// Route to get user courses
router.get('/courses', authenticateToken, getUserCourses);
//router.get('/course/:id', authenticateToken, getCourseDetails);
// Route to get user profile
router.get('/profile', getUserProfile,authenticateToken);

export default router;
