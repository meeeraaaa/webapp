import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { mail: email },
    });

    // If user not found
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.Hashedpassword);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // assign jwt
    const token = jwt.sign(
      { userId: user.id, 
        role: user.role,
        designation: user.designationId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10h" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.mail,
        role: user.role,
        designation: user.designationId,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addEmployee = async (req, res) => {
    try {
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
          role: "EMPLOYEE",  // All new users will be employees
          designationId: designationId,
          sex: sex,
          experience: experience,
          joindate: new Date(),
          Hashedpassword: hashedPassword,
        },
      });
  
      return res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

export const validate = async (req, res) => {
  return res.status(200).json({ message: "Token is valid", user: req.user });
};