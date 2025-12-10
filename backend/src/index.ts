import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import path from "path";

import { connectDB } from "./config/db";
import heroRoutes from "./routes/heroRoutes";
import authRoutes from "./routes/authRoutes";



const app = express();
const PORT = process.env.PORT || 5500;

// DB
connectDB();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Dossier statique pour les images uploadées
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//Car dans ma base de donnée mongoDB , image est stocké sous forme image : "md/11-agent-zero.jpg"
app.use("/md", express.static(path.join(__dirname, "md")));

// Routes
app.use("/api/heroes", heroRoutes);
app.use("/api/auth", authRoutes);

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
