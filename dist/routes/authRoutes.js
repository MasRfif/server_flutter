"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post("/register", [
    (0, express_validator_1.body)("email").isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password").isLength({ min: 6 }),
], authController_1.registerUser);
router.post("/login", [(0, express_validator_1.body)("email").isEmail().normalizeEmail(), (0, express_validator_1.body)("password").notEmpty()], authController_1.loginUser);
exports.default = router;
