import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the header

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    req.user = user; // Attach the user to the request
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(403).json({ error: "Invalid token." });
  }
};

// Role-based authorization middleware for admin
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};
