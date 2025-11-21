import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/authRoutes.js";
import objavaRoutes from "./src/routes/objavaRoutes.js";
import odsjekRoutes from "./src/routes/odsjekRoutes.js";
import korisnikRoutes from "./src/routes/korisnikRoutes.js";

dotenv.config();

// Ispravno rješavanje __dirname za ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB povezan!"))
  .catch((err) => console.error("Greška spajanja s bazom:", err));

// API rute - OVO stavi prije static ruta!
app.use("/api/auth", authRoutes);
app.use("/api/objave", objavaRoutes);
app.use("/api/odsjeci", odsjekRoutes);
app.use("/api/korisnik", korisnikRoutes);

// SERVIRAJ FRONTEND STATIC FILES (Vite build, obično "dist" folder)
app.use(express.static(path.join(__dirname, "dist")));

// **Ispravan SPA FALLBACK** NA KRAJU file-a, ali pazi na route format:
// Ovo mora biti POSLJEDNJE, POSLIJE SVIH API I STATIC ROUTA!
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "dist/index.html"));
});

// Pokreni server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
