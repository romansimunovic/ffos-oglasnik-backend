import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import objavaRoutes from "./routes/objavaRoutes.js";
import odsjekRoutes from "./routes/odsjekRoutes.js";

const app = express();

// 👇 dopušteni frontend port
const allowedOrigin = "http://localhost:5182";

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/objave", objavaRoutes);
app.use("/api/odsjeci", odsjekRoutes);

app.get("/", (req, res) => res.send("✅ FFOS Oglasnik backend radi!"));

export default app;
