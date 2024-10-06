//C:\Users\AnanyaSarkar\Documents\project\webapp\backend\controllers\adminController.js
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import prisma from'../db.js';

// controllers/adminController.js

export const getCourseCompletionByDesignation = async (req, res) => {
  const { courseId } = req.params; // Get course ID from the request parameters

  try {
    // Fetch all designations
    const designations = await prisma.designation.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    // Create a result array to store counts of completed vs not completed employees per designation
    const completionData = [];

    for (const designation of designations) {
      // Get employees under each designation
      const employees = await prisma.user.findMany({
        where: { designationId: designation.id },
        select: {
          id: true,
        },
      });

      // Check how many employees have completed the course (percentage_completed = 100)
      const completedCount = await prisma.progress.count({
        where: {
          courseId: parseInt(courseId, 10),
          userId: { in: employees.map((emp) => emp.id) },
          percentage_completed: 100,
        },
      });

      // Total employees assigned to this course
      const totalAssigned = await prisma.progress.count({
        where: {
          courseId: parseInt(courseId, 10),
          userId: { in: employees.map((emp) => emp.id) },
        },
      });

      // Calculate non-completed employees
      const notCompletedCount = totalAssigned - completedCount;

      completionData.push({
        designation: designation.title,
        completed: completedCount,
        notCompleted: notCompletedCount,
      });
    }

    res.status(200).json(completionData);
  } catch (error) {
    console.error('Error fetching course completion by designation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getSkillsByDesignation = async (req, res) => {
  const skillId = parseInt(req.params.skillId);

  try {
      // Check if the skillId is valid
      if (isNaN(skillId)) {
          return res.status(400).json({ error: 'Invalid skill ID' });
      }

      // Fetch count of employees for the given skill grouped by designation
      const data = await prisma.userSkill.groupBy({
          by: ['designationId'],
          where: { skillId: skillId },
          _count: {
              userId: true, // Count the number of users having this skill
          },
          include: {
              designation: true, // Include designation details
          },
      });

      // Map the results to the desired format
      const result = data.map(item => ({
          designation: item.designation.title, // Get designation title
          count: item._count.userId, // Get the count of users
      }));

      // Return the result as a JSON response
      res.json(result);
  } catch (error) {
      console.error('Error fetching skills by designation:', error);
      res.status(500).json({ error: 'Something went wrong' });
  }
};
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
