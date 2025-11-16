import Korisnik from "../models/Korisnik.js";

const getUserIdFromReq = (req) => {
  // ovisi što ti verifyToken radi – obično je ili req.user.id ili req.user._id
  return req.user?.id || req.user?._id || req.userId;
};

// POST /api/korisnik/spremiObjavu/:objavaId
export const spremiObjavu = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { objavaId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Neautorizirano." });
    }

    const korisnik = await Korisnik.findById(userId);
    if (!korisnik) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    // ne duplicirati istu objavu
    const postoji = korisnik.spremljeneObjave.some(
      (id) => id.toString() === objavaId
    );
    if (!postoji) {
      korisnik.spremljeneObjave.push(objavaId);
      await korisnik.save();
    }

    return res.json({ message: "Objava spremljena." });
  } catch (err) {
    console.error("Greška spremiObjavu:", err);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};

// GET /api/korisnik/spremljene
export const dohvatiSpremljeneObjave = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "Neautorizirano." });
    }

    const korisnik = await Korisnik.findById(userId).populate(
      "spremljeneObjave"
    );
    if (!korisnik) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    return res.json(korisnik.spremljeneObjave || []);
  } catch (err) {
    console.error("Greška dohvatiSpremljeneObjave:", err);
    return res.status(500).json({ message: "Greška na serveru." });
  }
};
