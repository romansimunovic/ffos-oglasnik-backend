// src/controllers/obavijestController.js
import Obavijest from "../models/Obavijest.js";

/**
 * Helper koji možeš pozvati iz drugih controller-a (ne HTTP handler).
 * Usage:
 *   await createNotificationForUser({ userId, title, message, objavaId });
 */
export const createNotificationForUser = async ({ userId, title, message, objavaId = null }) => {
  if (!userId) throw new Error("Missing userId for notification");
  const n = await Obavijest.create({
    korisnik: userId,
    title,
    message,
    objavaId,
  });
  return n;
};

// ---- Express handlers (HTTP) ----

// POST /api/korisnik/:userId/obavijesti
export const createNotification = async (req, res) => {
  try {
    const korisnikId = req.params.userId;
    const { title, message, objavaId } = req.body;
    if (!korisnikId) return res.status(400).json({ message: "Nedostaje ID korisnika." });
    const n = await Obavijest.create({ korisnik: korisnikId, title, message, objavaId });
    return res.status(201).json(n);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/korisnik/:userId/obavijesti
export const getNotificationsForUser = async (req, res) => {
  try {
    const korisnikId = req.params.userId;
    const notifs = await Obavijest.find({ korisnik: korisnikId }).sort({ createdAt: -1 }).limit(50);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/korisnik/:userId/obavijesti/:notifId/read
export const markNotificationRead = async (req, res) => {
  try {
    const { notifId } = req.params;
    await Obavijest.findByIdAndUpdate(notifId, { read: true });
    res.json({ message: "Označeno kao pročitano" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
