const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Hash the password for admin
    const hashedPassword = await bcrypt.hash('root', 10);
    // Define skills
    const skills = await prisma.skill.createMany({
        data: [
            { name: 'JavaScript' },
            { name: 'Python' },
            { name: 'Java' },
            { name: 'C#' },
            { name: 'SQL' },
            { name: 'HTML' },
            { name: 'CSS' },
            { name: 'React' },
            { name: 'Node.js' },
            { name: 'Django' }
        ]
    });

    console.log('Skills created:', skills);

    // Define designations
    const designations = await prisma.designation.createMany({
        data: [
            { title: 'SDE' },
            { title: 'SDE2' },
            { title: 'Enabler' },
            { title: 'Consultant' },
            { title: 'Architect' }
        ]
    });

    console.log('Designations created:', designations);

    // Define courses
    const courses = await prisma.course.createMany({
        data: [
            { title: 'Full Stack Development', difficulty_level: 'Medium', no_of_chapters: 10, duration: 30 },
            { title: 'Data Science with Python', difficulty_level: 'Hard', no_of_chapters: 8, duration: 25 },
            { title: 'Web Development Basics', difficulty_level: 'Easy', no_of_chapters: 5, duration: 15 },
            { title: 'Advanced Java Programming', difficulty_level: 'Hard', no_of_chapters: 6, duration: 20 },
            { title: 'Introduction to SQL', difficulty_level: 'Easy', no_of_chapters: 4, duration: 10 }
        ]
    });

    console.log('Courses created:', courses);

    // Assign skills to courses
    const courseSkills = await prisma.courseSkill.createMany({
        data: [
            { courseId: 1, skillId: 1 }, // Full Stack Development covers JavaScript
            { courseId: 1, skillId: 8 }, // Full Stack Development covers React
            { courseId: 1, skillId: 10 }, // Full Stack Development covers Node.js
            { courseId: 2, skillId: 2 }, // Data Science with Python covers Python
            { courseId: 2, skillId: 6 }, // Data Science with Python covers SQL
            { courseId: 3, skillId: 1 }, // Web Development Basics covers JavaScript
            { courseId: 3, skillId: 5 }, // Web Development Basics covers SQL
            { courseId: 4, skillId: 3 }, // Advanced Java Programming covers Java
            { courseId: 5, skillId: 5 }, // Introduction to SQL covers SQL
        ]
    });

    console.log('Course skills assigned:', courseSkills);

    // Assign skills to designations
    const designationSkills = await prisma.designationSkill.createMany({
        data: [
            { designationId: 1, skillId: 1 }, // SDE needs JavaScript
            { designationId: 1, skillId: 5 }, // SDE needs SQL
            { designationId: 2, skillId: 1 }, // SDE2 needs JavaScript
            { designationId: 2, skillId: 3 }, // SDE2 needs Java
            { designationId: 3, skillId: 2 }, // Enabler needs Python
            { designationId: 3, skillId: 6 }, // Enabler needs SQL
            { designationId: 4, skillId: 3 }, // Consultant needs Java
            { designationId: 4, skillId: 4 }, // Consultant needs C#
            { designationId: 5, skillId: 8 }, // Architect needs React
            { designationId: 5, skillId: 1 }  // Architect needs JavaScript
        ]
    });

    console.log('Designation skills assigned:', designationSkills);
    // Fetch architect designation ID for the admin user
    const architectDesignation = await prisma.designation.findFirst({
        where: {
            title: 'Architect'
        }
    });

    // Seed the admin user
    const adminUser = await prisma.user.create({
        data: {
            name: 'admin',
            mail: 'adminnnn@jmangroup.com',
            role: 'ADMIN',
            designationId: architectDesignation.id, // Admin's designation: Architect
            sex: 'F',
            experience: 14,
            joindate: new Date('2010-01-01T00:00:00Z'), // Admin's join date: 1st January 2010
            Hashedpassword: hashedPassword, // Use the hashed password
        }
    });

    console.log('Admin user created:', adminUser);

}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
