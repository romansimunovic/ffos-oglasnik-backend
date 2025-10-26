import express from "express";
import { registracija, prijava } from "../controllers/korisnikController.js";
const router = express.Router();

router.post("/register", registracija);
router.post("/login", prijava);

export default router;
