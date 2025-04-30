"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controllers/bookController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Apply authentication middleware to all routes in this file (example)
router.use(authMiddleware_1.authenticateToken);
// Route to add a new book
router.post("/", bookController_1.createBook);
// Route to get a specific book by ID
router.get("/:id", bookController_1.getBookById);
exports.default = router;
