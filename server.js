import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

connectDB();
const app = express();

// Middleware
app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:3000", // React frontend
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://aichat-frontend-blue.vercel.app"
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

