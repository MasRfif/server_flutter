import express from "express";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticateToken } from "./middlewares/authMiddleware";

const app = express();
const port = 3069;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", authenticateToken, bookRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
