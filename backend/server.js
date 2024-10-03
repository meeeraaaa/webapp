//C:\Users\AnanyaSarkar\Documents\project\webapp\backend\server.js
import express from "express";
import cors from "cors";
import bodyparser from 'body-parser';
import dotenv from 'dotenv';

const port = 1200;

const app = express();

// Set up Global configuration access
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
//path
app.use('/auth', authRoutes);
app.use('/admin',adminRoutes);
app.use('/user', userRoutes); 

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});