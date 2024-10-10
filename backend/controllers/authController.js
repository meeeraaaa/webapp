import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {    
    const { email, password } = req.body;
    //console.log("front end able to send Email:", email, " and Password:", password);

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { mail: email },
    });

    
    
    
    // If user not found
    if (!user|| !await bcrypt.compare(password, user.Hashedpassword)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    

    // assign jwt
    const token = jwt.sign(
      { userId: user.id, 
        role: user.role,
        },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10h" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.mail,
        role: user.role
       
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// export const validate = async (req, res) => {
//   return res.status(200).json({ message: "Token is valid", user: req.user });
// };