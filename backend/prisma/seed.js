import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear the database
  await prisma.userSkill.deleteMany({});
  await prisma.courseSkill.deleteMany({});
  await prisma.designationSkill.deleteMany({});
  await prisma.progress.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.designation.deleteMany({});
  await prisma.course.deleteMany({});

  console.log('Database cleared');

  // Seed skills
  const skills = [
    { name: 'JavaScript' },
    { name: 'Python' },
    { name: 'Java' },
    { name: 'C#' },
    { name: 'SQL' },
    { name: 'HTML' },
    { name: 'CSS' },
    { name: 'React' },
    { name: 'Node.js' },
    { name: 'Django' },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }

  // Seed designations
  const designations = [
    { title: 'SDE' },
    { title: 'SDE2' },
    { title: 'Enabler' },
    { title: 'Consultant' },
    { title: 'Architect' },
  ];

  for (const designation of designations) {
    await prisma.designation.upsert({
      where: { title: designation.title },
      update: {},
      create: designation,
    });
  }

  // Retrieve designation IDs to use for user creation
  const allDesignations = await prisma.designation.findMany();
  const designationMap = Object.fromEntries(allDesignations.map(d => [d.title, d.id]));

  // Seed courses
  const courses = [
    { title: 'Full Stack Development', difficulty_level: 'Medium', no_of_chapters: 10, duration: 30 },
    { title: 'Data Science with Python', difficulty_level: 'Hard', no_of_chapters: 8, duration: 25 },
    { title: 'Web Development Basics', difficulty_level: 'Easy', no_of_chapters: 5, duration: 15 },
    { title: 'Advanced Java Programming', difficulty_level: 'Hard', no_of_chapters: 6, duration: 20 },
    { title: 'Introduction to SQL', difficulty_level: 'Easy', no_of_chapters: 4, duration: 10 },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { title: course.title },
      update: {},
      create: course,
    });
  }

  const allSkills = await prisma.skill.findMany();
  const allCourses = await prisma.course.findMany();

  // Create CourseSkill relationships
  for (const course of allCourses) {
    for (const skill of allSkills) {
      await prisma.courseSkill.create({
        data: {
          courseId: course.id,
          skillId: skill.id,
        },
      });
    }
  }

  // Create DesignationSkill relationships
  for (const designation of allDesignations) {
    for (const skill of allSkills) {
      await prisma.designationSkill.create({
        data: {
          designationId: designation.id,
          skillId: skill.id,
        },
      });
    }
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('root', 10);

  await prisma.user.create({
    data: {
      name: 'admin',
      mail: 'adminnnn@jmangroup.com',
      role: 'admin',
      designationId: designationMap['Architect'], // Use the mapped ID
      sex: 'f',
      experience: 14,
      joindate: new Date('2010-01-01T00:00:00Z'),
      Hashedpassword: hashedPassword,
    }
  });

  // Seed additional employees with correct designation IDs
  const employees = [
    {
      name: "purnima",
      mail: "purnima@jmangroup.com",
      designationId: designationMap['Enabler'], // Use the mapped ID
      sex: "f",
      experience: 4
    },
    {
      name: "harsh",
      mail: "harsh@jmangroup.com",
      designationId: designationMap['SDE2'], // Use the mapped ID
      sex: "m",
      experience: 4
    },
    {
      name: "aishwarya",
      mail: "aishwarya@jmangroup.com",
      designationId: designationMap['Architect'], // Use the mapped ID
      sex: "f",
      experience: 12
    },
    {
      name: "ashwin",
      mail: "ashwin@jmangroup.com",
      designationId: designationMap['SDE'], // Use the mapped ID
      sex: "m",
      experience: 3
    }
  ];

  for (const employee of employees) {
    await prisma.user.create({
      data: {
        name: employee.name,
        mail: employee.mail,
        role: 'employee',
        designationId: employee.designationId, // Use the mapped ID
        sex: employee.sex,
        experience: employee.experience,
        joindate: new Date(),
        Hashedpassword: hashedPassword,
      }
    });
  }

  console.log('Seeding completed');
}

main()
  .catch(e => console.error('Error seeding data:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
