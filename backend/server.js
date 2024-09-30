const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const port = 1200;

 const app = express();
 const prisma = new PrismaClient();
// Set up Global configuration access
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});