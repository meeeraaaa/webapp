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
  COALESCE(COUNT(p.courseId), 0) AS total_courses, 
  COALESCE(SUM(CASE WHEN p.updatedAt > NOW() - INTERVAL '30 days' THEN 1 ELSE 0 END), 0) AS active_courses
FROM 
  "User" u
JOIN 
  "Designation" d ON u.designationId = d.id
LEFT JOIN 
  "Progress" p ON u.id = p.userId
GROUP BY 
  u.id, d.title;

      `);

    res.status(200).json(result.rows); // Send the fetched employees as JSON
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};