import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Clear the database
  await prisma.userSkill.deleteMany({});
  await prisma.courseSkill.deleteMany({});
  await prisma.designationSkill.deleteMany({});
  await prisma.progress.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.designation.deleteMany({});
  await prisma.course.deleteMany({});

  console.log('Database cleared');

  // 2. Seed data
  const hashedPassword = await bcrypt.hash('root', 10);

  // Seed skills using upsert
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
    { name: 'Django' }
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {}, // No update needed if it already exists
      create: skill,
    });
  }

  // Seed designations using upsert
  const designations = [
    { title: 'SDE' },
    { title: 'SDE2' },
    { title: 'Enabler' },
    { title: 'Consultant' },
    { title: 'Architect' }
  ];

  for (const designation of designations) {
    await prisma.designation.upsert({
      where: { title: designation.title },
      update: {}, // No update needed if it already exists
      create: designation,
    });
  }

  // Seed courses using upsert
  const courses = [
    { title: 'Full Stack Development', difficulty_level: 'Medium', no_of_chapters: 10, duration: 30 },
    { title: 'Data Science with Python', difficulty_level: 'Hard', no_of_chapters: 8, duration: 25 },
    { title: 'Web Development Basics', difficulty_level: 'Easy', no_of_chapters: 5, duration: 15 },
    { title: 'Advanced Java Programming', difficulty_level: 'Hard', no_of_chapters: 6, duration: 20 },
    { title: 'Introduction to SQL', difficulty_level: 'Easy', no_of_chapters: 4, duration: 10 }
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { title: course.title },
      update: {}, // No update needed if it already exists
      create: course,
    });
  }

  const architectDesignation = await prisma.designation.findFirst({
    where: { title: 'Architect' }
  });

  await prisma.user.create({
    data: {
      name: 'admin',
      mail: 'adminnnn@jmangroup.com',
      role: 'admin',
      designationId: architectDesignation.id,
      sex: 'f',
      experience: 14,
      joindate: new Date('2010-01-01T00:00:00Z'),
      Hashedpassword: hashedPassword,
    }
  });

  console.log('Seeding completed');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
