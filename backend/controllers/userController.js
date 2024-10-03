//C:\Users\AnanyaSarkar\Documents\project\webapp\backend\controllers\userController.js
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import prisma from '../db.js';
export const startCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
      // Validate input
      if (!userId || !courseId) {
        return res.status(400).json({ error: "User ID and Course ID are required" });
      }
  
      // Create a new progress entry for the employee
      const progressEntry = await prisma.progress.create({
        data: {
          user: { connect: { id: userId } },
          course: { connect: { id: courseId } },
          chapters_completed: 0,
          percentage_completed: 0,
        },
      });
  
      return res.status(201).json({ message: "Course started successfully", progress: progressEntry });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

export const updateCourseProgress = async (req, res) => {
    const { userId, courseId, chaptersCompleted } = req.body;

    try {
        // Fetch total chapters in the course
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
            select: { no_of_chapters: true }
        });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const totalChapters = course.no_of_chapters;

        // Fetch current progress for the user and course
        const currentProgress = await prisma.progress.findMany({
            where: {
                userId: parseInt(userId),
                courseId: parseInt(courseId),
            },
            orderBy: {
                updatedAt: 'desc',
            },
            select: {
                chapters_completed: true,
            },
        });

        // Calculate new chapters completed
        const previousChaptersCompleted = currentProgress.length > 0 
            ? currentProgress.reduce((acc, progress) => acc + progress.chapters_completed, 0)
            : 0;

        const newChaptersCompleted = previousChaptersCompleted + chaptersCompleted;

        // Create a new progress entry
        const progress = await prisma.progress.create({
            data: {
                userId: parseInt(userId),
                courseId: parseInt(courseId),
                chapters_completed: newChaptersCompleted,
                percentage_completed: Math.min(100, (newChaptersCompleted / totalChapters) * 100),
            },
        });

        return res.status(201).json({ message: "Progress recorded successfully", progress });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


// Complete a course and add the skill
// Complete a course and add the skill
export const completeCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        // Validate input
        if (!userId || !courseId) {
            return res.status(400).json({ error: "User ID and Course ID are required" });
        }

        // Get the number of chapters of the course and its skills
        const courseWithChapters = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
            select: { no_of_chapters: true, skills: true } // Number of chapters and skills
        });

        if (!courseWithChapters) {
            return res.status(404).json({ error: "Course not found" });
        }

        const { no_of_chapters, skills } = courseWithChapters;

        // Create a new progress entry for course completion
        const progress = await prisma.progress.create({
            data: {
                userId: parseInt(userId),
                courseId: parseInt(courseId),
                chapters_completed: no_of_chapters,
                percentage_completed: 100,
                certificate: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RL32F8U1YP9Sm9zeAUSpEWYsMJVItkdidA&s",
            }
        });

        // Get current skills of the user
        const currentUserSkills = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                skills: {
                    select: {
                        id: true
                    }
                }
            }
        });

        // Extract the IDs of current skills
        const currentSkillIds = currentUserSkills.skills.map(skill => skill.id);

        // Identify new skills that need to be added
        const newSkills = skills.filter(skill => !currentSkillIds.includes(skill.id));

        // Check if new skills exist in the database
        const existingSkills = await prisma.skill.findMany({
            where: {
                id: { in: newSkills.map(skill => skill.id) }
            }
        });

        // Only connect new skills if there are valid ones to add
        if (existingSkills.length > 0) {
            await prisma.user.update({
                where: { id: parseInt(userId) },
                data: {
                    skills: {
                        connect: existingSkills.map(skill => ({ id: skill.id }))
                    }
                }
            });
        } else {
            console.warn("No valid new skills found to connect.");
        }

        return res.status(201).json({ message: "Course completed and progress recorded successfully", progress });
    } catch (error) {
        console.error("Error updating course completion:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const getUserProfile = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                mail: true,
                skills: { select: { skill: { select: { name: true } } } },
                progress: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                                progress: {
                                    where: {
                                        userId: userId,
                                        percentage_completed: 100 
                                    },
                                    select: {
                                        percentage_completed: true,
                                        certificate: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const completedCourses = user.progress.filter(item => item.course.progress.length > 0);

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                mail: user.mail,
                skills: user.skills.map(skill => skill.skill.name),
                completedCourses: completedCourses.map(course => ({
                    id: course.course.id,
                    title: course.course.title,
                    percentage_completed: course.course.progress[0]?.percentage_completed,
                    certificate: course.course.progress[0]?.certificate
                }))
            }
        });
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const getUserCourses = async (req, res) => {
    const userId = req.user.userId;

    try {
        const progress = await prisma.progress.findMany({
            where: { userId: userId },
            include: {
                course: {
                    select: { id: true, title: true, no_of_chapters: true }
                }
            }
        });

        const courses = progress.map(item => ({
            id: item.course.id,
            title: item.course.title,
            percentage_completed: item.percentage_completed,
        }));

        return res.status(200).json({ courses });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

