"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookById = exports.createBook = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Controller for creating a new book
const createBook = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ message: "Failed to create book", error });
    }
};
exports.createBook = createBook;
// Controller for getting a book by ID
const getBookById = async (req, res) => {
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
        }
        else {
            res.status(404).json({ message: "Book not found" });
        }
    }
    catch (error) {
        console.error("Error getting book:", error);
        res.status(500).json({ message: "Failed to get book", error });
    }
};
exports.getBookById = getBookById;
// Add more controller functions for other book-related actions (update, delete, get all, etc.)
