import Korisnik from "../models/Korisnik.js";

const getUserIdFromReq = (req) => {
  // ovisi što ti verifyToken radi – obično je ili req.user.id ili req.user._id
  return req.user?.id || req.user?._id || req.userId;
};

export const spremiObjavu = async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.user._id);
    const objava = await Objava.findById(req.params.objavaId);
    if (!korisnik || !objava) return res.status(404).json({ message: "Korisnik ili objava ne postoji." });

    // Provjera dupliciranosti
    if (!korisnik.spremljeneObjave.some(id => id.equals(objava._id))) {
      korisnik.spremljeneObjave.push(objava._id);
      await korisnik.save();
    }
    res.status(200).json({ message: "Objava spremljena." });
  } catch (err) {
    res.status(500).json({ message: "Greška pri spremanju objave.", error: err.message });
  }
};

export const getSpremljeneObjave = async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.user._id)
      .populate({ path: "spremljeneObjave", populate: { path: "autor", select: "ime" } });

    if (!korisnik) return res.status(404).json([]);
    const spremljene = korisnik.spremljeneObjave.map(objava => ({
      _id: objava._id,
      naslov: objava.naslov,
      sadrzaj: objava.sadrzaj,
      tip: objava.tip,
      status: objava.status,
      autor: objava.autor?.ime || "Nepoznato",
      odsjek: objava.odsjek || "-",
      platforma: objava.platforma,
      datum: objava.datum
    }));
    res.status(200).json(spremljene);
  } catch (err) {
    console.error("Greška dohvaćanja spremljenih objava:", err);
    res.status(500).json({ message: "Greška servera." });
  }
};

