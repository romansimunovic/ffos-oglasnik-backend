import Korisnik from "../models/Korisnik.js";

const getUserIdFromReq = (req) => {
  // ovisi što ti verifyToken radi – obično je ili req.user.id ili req.user._id
  return req.user?.id || req.user?._id || req.userId;
};

// npr. /korisnik/spremiObjavu/:id
export const spremiObjavu = async (req, res) => {
  try {
    const userId = req.user.id;
    const objavaId = req.params.id;

    const korisnik = await Korisnik.findById(userId);
    if (!korisnik) return res.status(404).json({ message: "Korisnik nije pronađen." });

    // Dodaj ako ne postoji već u spremljeneObjave
    if (!korisnik.spremljeneObjave.includes(objavaId)) {
      korisnik.spremljeneObjave.push(objavaId);
      await korisnik.save();
    }

    res.status(200).json({ message: "Objava spremljena." });
  } catch (err) {
    console.error("Greška pri spremanju objave:", err); // LOG!
    res.status(500).json({ message: "Greška pri spremanju objave.", error: err.message });
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
