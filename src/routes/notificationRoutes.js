import express from "express";
import { getNotificationsForUser, markNotificationRead } from "../controllers/notificationController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// dohvat obavijesti za korisnika (može i non-auth ako želiš, ali bolje protect)
router.get("/:userId/obavijesti", protect, getNotificationsForUser);

// označi kao pročitano
router.post("/:userId/obavijesti/:notifId/read", protect, markNotificationRead);

export default router;
