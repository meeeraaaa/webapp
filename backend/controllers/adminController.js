//C:\Users\AnanyaSarkar\Documents\project\webapp\backend\controllers\adminController.js
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import prisma from'../db.js';

// Get courses for a specific employee with progress and course details
// Get courses for a specific employee with progress and course details
export const getEmployeeCourses = async (req, res) => {
  const { id } = req.params; // Extract employee ID from the request parameters

  try {
    const courses = await prisma.progress.findMany({
      where: { userId: Number(id) },
      include: {
        course: { // Include course details
          select: {
            title: true,
            difficulty_level: true,
            no_of_chapters: true,
            duration: true,
          }
        }
      },
    });

    // If no courses are found for the employee
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found for this employee." });
    }

    // Map the result to include progress details along with course details
    const response = courses.map(course => ({
      chapters_completed: course.chapters_completed,
      percentage_completed: course.percentage_completed,
      updatedAt: course.updatedAt,
      course: course.course, // Course details
    }));

    // Return the courses with progress and course details
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching employee courses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const addEmployee = async (req, res) => {
  try {
    //console.log(req);

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
    const employees = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        joindate: true,
        designation: {
          select: {
            title: true
          }
        }
      }
    });

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEmployeeProgress = async (req, res) => {
  const { id: employeeId } = req.params; // Destructure the id directly
  try {
      const progressData = await prisma.progress.findMany({
          where: { userId: Number(employeeId) }, // Ensure employeeId is a number
          include: {
              course: true, // Include course details
          },
      });

      // Transform data into a structure suitable for the chart
      const response = progressData.map(entry => ({
          date: entry.updatedAt.toISOString().split('T')[0], // Extract date
          courseTitle: entry.course.title, // Course title
          percentage_completed: entry.percentage_completed,
          chapters_completed: entry.chapters_completed,
      }));

      return res.status(200).json(response);
  } catch (error) {
      console.error('Error fetching employee progress:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};
