import express, { Router } from "express";
import { createBook, getBookById } from "../controllers/bookController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Apply authentication middleware to all routes in this file (example)
router.use(authenticateToken);

// Route to add a new book
router.post("/make", createBook);

// Route to get a specific book by ID
router.get("/:id", getBookById);

// router get all books for a user
router.get("/", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const books = await prisma.book.findMany({
      where: {
        userId,
      },
    });
    res.json(books);
  } catch (error) {
    console.error("Error getting books:", error);
    res.status(500).json({ message: "Failed to get books", error });
  }
});

export default router;
