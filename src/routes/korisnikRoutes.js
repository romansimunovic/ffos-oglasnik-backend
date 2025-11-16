import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  spremiObjavu,
  dohvatiSpremljeneObjave,
} from "../controllers/korisnikController.js";

const router = express.Router();

// spremanje objave
router.post("/spremiObjavu/:objavaId", protect, spremiObjavu);

// dohvat svih spremljenih objava prijavljenog korisnika
router.get("/spremljene", protect, dohvatiSpremljeneObjave);

export default router;
