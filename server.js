import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import obavijestRoutes from "./src/routes/obavijestRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import objavaRoutes from "./src/routes/objavaRoutes.js";
import odsjekRoutes from "./src/routes/odsjekRoutes.js";
import korisnikRoutes from "./src/routes/korisnikRoutes.js";
import { ensureAdminUser } from "./src/utils/ensureAdminUser.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------------
// 📁 Ensure upload folders
// ------------------------
const uploadsDir = path.join(__dirname, "uploads");
const avatarsDir = path.join(uploadsDir, "avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// ------------------------
// 🔧 Middlewares
// ------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------
// 🌐 CORS (production + local dev)
// ------------------------
const allowedOrigins = [
  "http://localhost:5173", // Vite
  "http://localhost:3000", // fallback
  (process.env.FRONTEND_URL || "").trim(), // Vercel deploy
];

console.log("📌 Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // mobile apps, backend calls

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("❌ CORS blocked:", origin);
        return callback(new Error("CORS blocked: " + origin), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ------------------------
// 📁 Static file serving
// ------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------
// 🛣️ API Routes
// ------------------------
app.use("/api/auth", authRoutes);
app.use("/api/objave", objavaRoutes);
app.use("/api/odsjeci", odsjekRoutes);
app.use("/api/korisnik", korisnikRoutes);
app.use("/api/korisnik", obavijestRoutes); 

// ------------------------
// ⚡ Serve frontend build (optional)
// ------------------------
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API radi. Frontend build (dist) nije pronađen.");
  });
}

// ------------------------
// ❗ Global error handler
// ------------------------
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// ------------------------
// 🚀 Connect MongoDB + start server
// ------------------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB povezan!");

    try {
      await ensureAdminUser();
      console.log("👑 Admin user provjeren/kreiran");
    } catch (e) {
      console.error("⚠️ ensureAdminUser greška:", e.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server radi na portu ${PORT}`);
      console.log("🌐 CORS origins:", allowedOrigins);
    });
  })
  .catch((err) => {
    console.error("❌ Greška spajanja s bazom:", err);
    process.exit(1);
  });
