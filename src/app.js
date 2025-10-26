import express from "express";
import cors from "cors";
import objavaRoutes from "./routes/objavaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import inboxRoutes from "./routes/inboxRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/objave", objavaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inbox", inboxRoutes);

export default app;
