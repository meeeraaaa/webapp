//C:\Users\AnanyaSarkar\project\webapp\backend\controllers\courseController.js
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import prisma from '../db.js';

const pt=44;

export const getSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        skills: {
          include: {
            skill: true, // Include the actual Skill model to get the name
          },
        },
        progress: {
          select: {
            userId: true, 
          },
          distinct: ['userId'],
        },
      },
    });

    // Map over courses to structure the response
    const response = courses.map(course => ({
      id: course.id,
      title: course.title,
      difficulty_level: course.difficulty_level,
      no_of_chapters: course.no_of_chapters,
      duration: course.duration,
      createdAt: course.createdAt,
      skills: course.skills.map(courseSkill => courseSkill.skill.name), // Get skill name from the related Skill model
      numberOfEmployeesAssigned: course.progress.length, // Count of progress entries for this course
    }));

    return res.status(200).json(response);
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

    // Parse no_of_chapters as an integer and duration as a float
    const parsedNoOfChapters = parseInt(no_of_chapters, 10);
    const parsedDuration = parseFloat(duration);

    if (isNaN(parsedNoOfChapters) || isNaN(parsedDuration)) {
      return res.status(400).json({ error: "Invalid number of chapters or duration" });
    }

    // Create new course
    const newCourse = await prisma.course.create({
      data: {
        title,
        difficulty_level,
        no_of_chapters: parsedNoOfChapters, // Use the parsed value
        duration: parsedDuration,           // Use the parsed value
        skills: {
          create: skills.map((skillId) => ({
            skill: { connect: { id: skillId } },
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

// Get a specific course by its ID
export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        skills: {
          include: {
            skill: true, // Include the skill details
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Structure the response to match your format
    const response = {
      id: course.id,
      title: course.title,
      difficulty_level: course.difficulty_level,
      no_of_chapters: course.no_of_chapters,
      duration: course.duration,
      createdAt: course.createdAt,
      skills: course.skills.map(courseSkill => courseSkill.skill.name), // Get skill names
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching course:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params; // Course ID from the URL
  const { title, difficulty_level, no_of_chapters, duration} = req.body; // Updated fields

  try {
   

    const updatedCourse = await prisma.course.update({
      where: { id: Number(id) }, // Find the course by ID
      data: {
        title,
        difficulty_level,
        no_of_chapters,
        duration
        
      },
    });

    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Assign course to employee
export const assignCourseToEmployee = async (req, res) => {
  const { courseId, userId } = req.body;

  try {
    // Fetch the current highest ID in the progress table
    const lastProgressEntry = await prisma.progress.findFirst({
      orderBy: { id: 'desc' } // Get the highest current ID
    });

    // Determine the next ID, starting from the highest existing ID + 1, or default to 1 if the table is empty
    const nextId = lastProgressEntry ? lastProgressEntry.id + 1 : 1;

    // Create the progress entry for the user and course, explicitly setting the ID
    const progress = await prisma.progress.create({
      data: {
        id: nextId, // Set the next ID for the new entry
        course: { connect: { id: courseId } },
        user: { connect: { id: userId } },
        chapters_completed: 0,
        percentage_completed: 0
      }
    });

    return res.status(201).json({ message: "Course assigned successfully", progress });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Get employees assigned to a specific course
export const getAssignedEmployees = async (req, res) => {
  const { courseId } = req.params;

  try {
    // Fetch employees already assigned to the course
    const progressEntries = await prisma.progress.findMany({
      where: {
        courseId: parseInt(courseId, 10),
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Use a Set to filter out duplicate employees
    const assignedEmployees = Array.from(new Set(
      progressEntries.map((entry) => JSON.stringify(entry.user))
    )).map((user) => JSON.parse(user));

    res.status(200).json(assignedEmployees);
  } catch (error) {
    console.error('Error fetching assigned employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
