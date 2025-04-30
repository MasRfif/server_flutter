"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.generateToken = exports.verifyPassword = exports.hashPassword = void 0;
// utils/auth.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Hash password
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(12);
    return await bcryptjs_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
// Verify password
const verifyPassword = async (password, hashedPassword) => {
    return await bcryptjs_1.default.compare(password, hashedPassword);
};
exports.verifyPassword = verifyPassword;
// Generate JWT token
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || "your-jwt-secret", {
        expiresIn: "1h",
    });
};
exports.generateToken = generateToken;
// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-jwt-secret", (err, decoded) => {
        if (err)
            return res.status(403).json({ message: "Forbidden" });
        req.userId = decoded.userId;
        next();
    });
};
exports.authenticateToken = authenticateToken;
