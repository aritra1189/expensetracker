// File: backend/server.js or index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

import { db } from "./DB/Database.js"; // Import the database connection
import transactionRoutes from "./Routers/Transactions.js"
import userRoutes from "./Routers/userRouter.js";

// Setup ES module __dirname & __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
db();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Allow all origins (no credentials support)
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

// Security headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Logging
app.use(morgan("dev"));

// Routes
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

