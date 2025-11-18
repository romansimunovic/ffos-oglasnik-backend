import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { spremiObjavu, getSpremljeneObjave } from "../controllers/korisnikController.js";

const router = express.Router();

router.post("/spremiObjavu/:objavaId", protect, spremiObjavu);
router.get("/spremljene", protect, getSpremljeneObjave);

export default router;
