import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authenticate from "./auth.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = 3069;

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "Login successful", token });
});

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

app.post("/books", authenticate, async (req, res) => {
  const { title, author, status, isFavorite } = req.body;
  const userId = req.userId;

  try {
    const book = await prisma.book.create({
      data: {
        title,
        author,
        status,
        isFavorite,
        userId,
      },
    });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: "Failed to add book" });
  }
});

app.get("/books", authenticate, async (req, res) => {
  const userId = req.userId;

  const books = await prisma.book.findMany({
    where: { userId },
  });

  res.json(books);
});

app.patch("/books/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { status, isFavorite } = req.body;

  try {
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        status,
        isFavorite,
      },
    });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: "Failed to update book" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
