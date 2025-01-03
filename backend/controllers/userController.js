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

        // Fetch the last ID from the progress table
        const lastProgressEntry = await prisma.progress.findMany({
            orderBy: { id: 'desc' },
            take: 1,
        });
        const newProgressId = lastProgressEntry.length > 0 ? lastProgressEntry[0].id + 1 : 1;

        // Create a new progress entry for the employee
        const progressEntry = await prisma.progress.create({
            data: {
                id: newProgressId,
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
    const { courseId, chaptersCompleted } = req.body;
    const userId = req.user.id;

    try {
        // Fetch course details to get the total number of chapters
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
            select: { no_of_chapters: true }
        });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const totalChapters = course.no_of_chapters;

        // Fetch the most recent progress for the user and course
        const currentProgress = await prisma.progress.findFirst({
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

        const previousChaptersCompleted = currentProgress ? currentProgress.chapters_completed : 0;

        // Calculate new chapters completed, ensuring not to exceed total chapters
        const newChaptersCompleted = Math.min(totalChapters, previousChaptersCompleted + chaptersCompleted);

        // Fetch the maximum ID from the progress table
        const maxIdRecord = await prisma.progress.findMany({
            select: { id: true },
            orderBy: { id: 'desc' },
            take: 1,
        });

        const nextId = maxIdRecord.length > 0 ? maxIdRecord[0].id + 1 : 1; // Start from 1 if the table is empty

        // Create a new progress entry
        const progress = await prisma.progress.create({
            data: {
                id: nextId,  // Assign the next available ID
                user: { connect: { id: parseInt(userId) } },
                course: { connect: { id: parseInt(courseId) } },
                chapters_completed: newChaptersCompleted,
                percentage_completed: (newChaptersCompleted / totalChapters) * 100,
            },
        });

        return res.status(201).json({ message: "Progress recorded successfully", progress });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const completeCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        // Validate input
        if (!userId || !courseId) {
            return res.status(400).json({ error: "User ID and Course ID are required" });
        }

        const userIdInt = parseInt(userId);
        const courseIdInt = parseInt(courseId);

        // Fetch the course and its associated skills
        const courseWithChapters = await prisma.course.findUnique({
            where: { id: courseIdInt },
            select: { no_of_chapters: true, skills: true }
        });

        if (!courseWithChapters) {
            return res.status(404).json({ error: "Course not found" });
        }

        const { no_of_chapters, skills } = courseWithChapters;

        // Fetch the last ID from the progress table
        const lastProgressEntry = await prisma.progress.findMany({
            orderBy: { id: 'desc' },
            take: 1,
        });
        const newProgressId = lastProgressEntry.length > 0 ? lastProgressEntry[0].id + 1 : 1;

        // Record the course progress
        const progress = await prisma.progress.create({
            data: {
                id: newProgressId,
                userId: userIdInt,
                courseId: courseIdInt,
                chapters_completed: no_of_chapters,
                percentage_completed: 100,
                certificate: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9RL32F8U1YP9Sm9zeAUSpEWYsMJVItkdidA&s", 
            }
        });

        // Get the user's current skills (from UserSkill table)
        const currentUserSkills = await prisma.userSkill.findMany({
            where: { userId: userIdInt },
            select: {
                skillId: true
            }
        });

        // Fetch the last ID from the userSkill table
        const lastUserSkillEntry = await prisma.userSkill.findMany({
            orderBy: { id: 'desc' },
            take: 1,
        });
        const newUserSkillId = lastUserSkillEntry.length > 0 ? lastUserSkillEntry[0].id + 1 : 1;

        // Extract the IDs of the user's current skills
        const currentSkillIds = currentUserSkills.map(userSkill => userSkill.skillId);

        // Identify the new skills that the user doesn't already have
        const newSkills = skills.filter(courseSkill => !currentSkillIds.includes(courseSkill.skillId));

        // Only insert new skills if there are any
        if (newSkills.length > 0) {
            await prisma.userSkill.createMany({
                data: newSkills.map(skill => ({
                    id: newUserSkillId, // Use the new ID
                    userId: userIdInt,
                    skillId: skill.skillId
                }))
            });

            return res.status(201).json({ message: "Course completed, new skills added, and progress recorded successfully", progress });
        }

        return res.status(201).json({ message: "Course completed, no new skills to update, progress recorded successfully", progress });
    } catch (error) {
        console.error("Error updating course completion:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export const getUserProfile = async (req, res) => {
    const userId = req.user.id; // Assume req.user is always set by middleware

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                id: true,
                name: true,
                mail: true,
                designation: { select: { title: true } },
                skills: { select: { skill: { select: { name: true } } } },
                progress: {
                    where: {
                        percentage_completed: 100,
                    },
                    orderBy: {
                        updatedAt: 'desc',
                    },
                    distinct: ['courseId'],
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const completedCourses = user.progress.map(item => ({
            id: item.course.id,
            title: item.course.title,
            percentage_completed: item.percentage_completed,
            certificate: item.certificate,
        }));

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                mail: user.mail,
                designation: user.designation.title,
                skills: user.skills.map(skill => skill.skill.name) || [],
                completedCourses
            }
        });
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getEmployeeProgress = async (req, res) => {
    const userId = req.user.id; // Logged-in user ID
    const courseId = parseInt(req.params.id); // Course ID from the URL

    try {
        // Fetch the course details (number of chapters, title, etc.)
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                title: true,
                no_of_chapters: true,
                difficulty_level: true,
                skills: {
                    select: {
                        skill: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Fetch the latest progress of the user for the given course
        const progress = await prisma.progress.findFirst({
            where: {
                userId: userId,
                courseId: courseId
            },
            orderBy: {
                updatedAt: 'desc' // Get the latest progress entry
            }
        });

        if (!progress) {
            return res.status(404).json({ error: "No progress found for this course" });
        }

        // Calculate the progress percentage if needed
        const completedChapters = progress.chapters_completed || 0;
        const percentageCompleted = (completedChapters / course.no_of_chapters) * 100;

        // Return the user's progress along with course details
        return res.status(200).json({
            course: {
                id: course.id,
                title: course.title,
                no_of_chapters: course.no_of_chapters,
                difficulty_level: course.difficulty_level,
                skills: course.skills
            },
            progress: {
                completed_chapters: completedChapters,
                percentage_completed: percentageCompleted,
                updatedAt: progress.updatedAt,
                certificate: progress.certificate
            }
        });
    } catch (error) {
        console.error("Error fetching employee progress:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserCourses = async (req, res) => {
    //const userId = req.user?.id;
    const userId = req.user.id; // Assume req.user is always set by middleware
    console.log("getUSERcourses",userId);
    try {
        // Fetch latest progress for all courses for the user
        const progress = await prisma.progress.findMany({
            where: {
                userId: parseInt(userId),
            },
            orderBy: {
                updatedAt: 'desc', // Ensure we get the latest progress entries
            },
            distinct: ['courseId'], // Get the latest entry per course
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        no_of_chapters: true
                    }
                }
            }
        });

        // Filter out courses where the latest progress is 100%
        const courses = progress
            .filter(item => item.percentage_completed < 100) // Only include courses that are not fully completed
            .map(item => ({
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

export const getCourseDetails = async(req,res) => { //opens up the course page for the user to update the progress 
    const userId = req.user.id;
    const courseId = parseInt(req.params.id);

    try {
        // Fetch the course details (like number of chapters)
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                id: true,
                title: true,
                no_of_chapters: true,
                difficulty_level: true,
                skills: { 
                    select: {
                        skill: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Fetch the user's last progress for this course
        const progress = await prisma.progress.findFirst({
            where: {
                userId: parseInt(userId),
                courseId: courseId
            },
            orderBy: {
                updatedAt: 'desc' // Get the latest progress
            }
        });

        // Determine how many chapters have been completed
        const completedChapters = progress ? progress.completed_chapters : 0;

        // Return course details along with the user's progress
        return res.status(200).json({
            course: {
                id: course.id,
                title: course.title,
                no_of_chapters: course.no_of_chapters,
                skills: course.skills
            },
            progress: {
                completed_chapters: completedChapters
            }
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}