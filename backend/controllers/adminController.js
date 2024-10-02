//C:\Users\AnanyaSarkar\Documents\project\webapp\backend\controllers\adminController.js
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import pool from '../db.js';

const prisma = new PrismaClient()

export const addEmployee = async (req, res) => {
  try {
    console.log(req);

    const { name, email, password, designationId, sex, experience } = req.body;

    // Validate required fields
    if (!email || !password || !name || !designationId || !sex || !experience) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { mail: email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new employee
    const newEmployee = await prisma.user.create({
      data: {
        name: name,
        mail: email,
        role: "employee",
        designationId: designationId,
        sex: sex,
        experience: experience,
        joindate: new Date(),
        Hashedpassword: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Employee created successfully", user: newEmployee });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};




export const getEmployees = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id AS userId,
        u.name,
        d.title AS designation,
        COUNT(p."courseId") AS total_courses,
        COUNT(CASE WHEN p.percentage_completed < 100 THEN 1 END) AS active_courses
      FROM 
        "User" u
      JOIN 
        "Designation" d ON u."designationId" = d.id
      LEFT JOIN 
        "Progress" p ON u.id = p."userId"
      GROUP BY 
        u.id, d.title;
      `);

    res.status(200).json(result.rows); // Send the fetched employees as JSON
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        skills: true // Include skills related to the course
      }
    });

    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const addCourse = async (req, res) => {
  try {
    const { title, difficulty_level, no_of_chapters, duration, skills } = req.body;

    // Validate required fields
    if (!title || !difficulty_level || !no_of_chapters || !duration) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new course
    const newCourse = await prisma.course.create({
      data: {
        title,
        difficulty_level,
        no_of_chapters,
        duration,
        skills: {
          create: skills.map(skillId => ({
            skill: { connect: { id: skillId } }
          })),
        },
      },
    });

    return res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Edit an existing course
export const updateCourse = async (req, res) => {
  const { id } = req.params; // Course ID from the URL
  const { title, difficulty_level, no_of_chapters, duration, skillIds } = req.body; // Updated fields

  try {
    // Check if all provided skill IDs exist
    const skills = await prisma.skill.findMany({
      where: {
        id: {
          in: skillIds,
        },
      },
    });

    if (skills.length !== skillIds.length) {
      return res.status(400).json({ message: "One or more skill IDs are invalid." });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: Number(id) }, // Find the course by ID
      data: {
        title,
        difficulty_level,
        no_of_chapters,
        duration,
        skills: {
          connect: skillIds.map(skillId => ({ id: skillId })),
        },
      },
    });

    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// // Assign a course to an employee
// export const assignCourseToEmployee = async (req, res) => {
//   try {
//     const { userId, courseId } = req.body;

//     // Validate required fields
//     if (!userId || !courseId) {
//       return res.status(400).json({ error: "User ID and Course ID are required" });
//     }

//     // Create a new progress entry for the employee
//     const progressEntry = await prisma.progress.create({
//       data: {
//         userId: parseInt(userId),
//         courseId: parseInt(courseId),
//         chapters_completed: 0,
//         percentage_completed: 0,
//       },
//     });

//     return res.status(201).json({ message: "Course assigned successfully", progress: progressEntry });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };



// Assign course to employee
// export const assignCourseToEmployee = async (req, res) => {
//   const { courseId, userId } = req.body;

//   try {
//     const progress = await prisma.progress.create({
//       data: {
//         course: { connect: { id: courseId } },
//         user: { connect: { id: userId } },
//         chapters_completed: 0,
//         percentage_completed: 0
//       }
//     });

//     return res.status(201).json({ message: "Course assigned successfully", progress });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };