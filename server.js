// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/authRoutes.js";
import objavaRoutes from "./src/routes/objavaRoutes.js";
import odsjekRoutes from "./src/routes/odsjekRoutes.js";
import korisnikRoutes from "./src/routes/korisnikRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
const avatarsDir = path.join(uploadsDir, "avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - prefer explicit origin from env; fallback to true for development
const allowedOrigin = process.env.FRONTEND_URL || true;
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// serve uploaded files (so frontend može pristupiti /uploads/avatars/...)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// connect to Mongo
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB povezan!"))
  .catch((err) => console.error("Greška spajanja s bazom:", err));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/objave", objavaRoutes);
app.use("/api/odsjeci", odsjekRoutes);
app.use("/api/korisnik", korisnikRoutes);

// serve frontend (Vite build) if exists
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
} else {
  // helpful fallback for API-only mode
  app.get("/", (req, res) => {
    res.send("API radi. Frontend build (dist) nije pronađen na serveru.");
  });
}

// global error handler (simple)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  // multer fileFilter returns Error object; if so, send 400
  if (err && err.message && err.message.includes("Samo")) {
    return res.status(400).json({ message: err.message });
  }
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
