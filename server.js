import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.js";
import objavaRoutes from "./src/routes/objavaRoutes.js";
import odsjekRoutes from "./src/routes/odsjekRoutes.js";
import korisnikRoutes from "./src/routes/korisnikRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB povezan! "))
  .catch((err) => console.error("Greška spajanja s bazom:", err));

app.use("/api/auth", authRoutes);
app.use("/api/objave", objavaRoutes);
app.use("/api/odsjeci", odsjekRoutes);
app.use("/api/korisnik", korisnikRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server radi na portu ${PORT} `));
