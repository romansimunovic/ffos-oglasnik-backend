import express from "express";
import { createNotification, getNotificationsForUser, markNotificationRead } from "../controllers/obavijestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// sve protect (ne želimo leak obavijesti)
router.post("/:userId/obavijesti", protect, createNotification); // šalje admin/frontend notifikaciju korisniku
router.get("/:userId/obavijesti", protect, getNotificationsForUser); // dohvat notifikacija
router.post("/:userId/obavijesti/:notifId/read", protect, markNotificationRead); // označi kao pročitano

export default router;
