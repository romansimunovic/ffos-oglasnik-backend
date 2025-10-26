import express from "express";
import { zapocniRazgovor, posaljiPoruku, dohvatiPoruke } from "../controllers/inboxController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", verifyToken, zapocniRazgovor);
router.post("/send", verifyToken, posaljiPoruku);
router.get("/:razgovorId", verifyToken, dohvatiPoruke);

export default router;
