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
import { ensureAdminUser } from "./src/utils/ensureAdminUser.js"; // ✅ NOVO

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

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy"));
    }
  },
  credentials: true
}));


// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
  app.get("/", (req, res) => {
    res.send("API radi. Frontend build (dist) nije pronađen na serveru.");
  });
}

// global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (err && err.message && err.message.includes("Samo")) {
    return res.status(400).json({ message: err.message });
  }
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

// Konekcija na Mongo + kreiranje admina + start servera
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB povezan!");

    //  ovdje jednom provjerimo / kreiramo admina!
    try {
      await ensureAdminUser();
    } catch (e) {
      console.error("Greška pri ensureAdminUser:", e.message);
    }

    app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
  })
  .catch((err) => {
    console.error("Greška spajanja s bazom:", err);
    process.exit(1);
  });
