import Notification from "../models/Notification.js";

// GET /korisnik/:userId/obavijesti
export const getNotificationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // sigurnosna provjera: ako postoji req.user i nije isti user i nije admin, return 403
    if (req.user && req.user._id && req.user._id.toString() !== userId && req.user.uloga !== "admin") {
      return res.status(403).json({ message: "Nemaš pravo vidjeti tuđe obavijesti." });
    }

    const notifs = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(notifs);
  } catch (err) {
    console.error("getNotificationsForUser error:", err);
    res.status(500).json({ message: "Greška pri dohvaćanju obavijesti.", error: err.message });
  }
};

// POST /korisnik/:userId/obavijesti/:notifId/read
export const markNotificationRead = async (req, res) => {
  try {
    const { userId, notifId } = req.params;

    // security: provjera
    if (req.user && req.user._id && req.user._id.toString() !== userId && req.user.uloga !== "admin") {
      return res.status(403).json({ message: "Nemaš pravo mijenjati tuđe obavijesti." });
    }

    const notif = await Notification.findOne({ _id: notifId, userId });
    if (!notif) return res.status(404).json({ message: "Obavijest nije pronađena." });

    notif.read = true;
    await notif.save();

    res.status(200).json({ message: "Obavijest označena kao pročitana." });
  } catch (err) {
    console.error("markNotificationRead error:", err);
    res.status(500).json({ message: "Greška pri označavanju obavijesti.", error: err.message });
  }
};

// helper (možeš importirati i koristiti iz drugih controllera)
export const createNotification = async ({ userId, objavaId = null, title, message, meta = null }) => {
  const n = new Notification({ userId, objavaId, title, message, meta });
  return n.save();
};
