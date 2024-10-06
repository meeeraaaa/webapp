// src/controllers/designationController.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDesignations = async (req, res) => {
  try {
    const designations = await prisma.designation.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    return res.json(designations);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
