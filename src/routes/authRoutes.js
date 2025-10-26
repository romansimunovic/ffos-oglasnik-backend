import express from "express";
import { registracija, prijava } from "../controllers/authController.js";

const router = express.Router();
router.post("/registracija", registracija);
router.post("/prijava", prijava);

export default router;
