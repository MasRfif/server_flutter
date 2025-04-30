import express, { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { registerUser, loginUser } from "../controllers/authController";
import { body } from "express-validator";

const router: Router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  loginUser
);

router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

router.delete("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = await prisma.user.delete({
    where: { id: userId },
  });
  res.json(user);
});

export default router;
