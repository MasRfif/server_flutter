import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const prisma = new PrismaClient();

// Controller for creating a new book
export const createBook = async (
  req: Request<
    ParamsDictionary,
    any,
    { title: string; author: string; description?: string },
    ParsedQs,
    Record<string, any>
  >,
  res: Response
) => {
  const { title, author, description } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        description,
        userId,
      },
    });
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Failed to create book", error });
  }
};

// Controller for getting all books for a user
export const getAllBooks = async (
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  res: Response
) => {
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
};

// Controller for getting a book by ID
export const getBookById = async (
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const book = await prisma.book.findUnique({
      where: {
        id: parseInt(id, 10),
        userId,
      },
    });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error getting book:", error);
    res.status(500).json({ message: "Failed to get book", error });
  }
};

// Controller for updating a book
export const updateBook = async (
  req: Request<
    ParamsDictionary,
    any,
    { title?: string; author?: string; description?: string },
    ParsedQs,
    Record<string, any>
  >,
  res: Response
) => {
  const { id } = req.params;
  const { title, author, description } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const updatedBook = await prisma.book.update({
      where: {
        id: parseInt(id, 10),
        userId,
      },
      data: {
        title,
        author,
        description,
      },
    });
    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Failed to update book", error });
  }
};

// Controller for deleting a book
export const deleteBook = async (
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await prisma.book.delete({
      where: {
        id: parseInt(id, 10),
        userId,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Failed to delete book", error });
  }
};

// Add more controller functions for other book-related actions (update, delete, get all, etc.)
