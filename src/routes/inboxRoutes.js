import express from "express";
import { dohvatiSveRazgovoreController } from "../controllers/inboxController.js";


import {
  zapocniRazgovorController,
  posaljiPorukuController,
  dohvatiPorukeController,
} from "../controllers/inboxController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", verifyToken, zapocniRazgovorController);
router.post("/send", verifyToken, posaljiPorukuController);
router.get("/:razgovorId", verifyToken, dohvatiPorukeController);
router.get("/svi", verifyToken, dohvatiSveRazgovoreController);

export default router;
