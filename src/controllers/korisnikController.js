// src/controllers/korisnikController.js
import Korisnik from "../models/Korisnik.js";
import Objava from "../models/Objava.js";

export const spremiObjavu = async (req, res) => {
  try {
    const objavaId = req.params.objavaId || req.params.id;
    if (!objavaId) return res.status(400).json({ message: "ID objave nije proslijeđen." });

    if (!req.user || !req.user._id) return res.status(401).json({ message: "Niste autorizirani." });

    // provjeri postoji li objava
    const objava = await Objava.findById(objavaId).select("_id");
    if (!objava) return res.status(404).json({ message: "Objava ne postoji." });

    // atomarno dodaj bez duplicata
    const updated = await Korisnik.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { spremljeneObjave: objava._id } },
      { new: true }
    ).select("spremljeneObjave");

    return res.status(200).json({
      message: "Objava spremljena.",
      count: updated?.spremljeneObjave?.length ?? 0
    });
  } catch (err) {
    console.error("spremiObjavu error:", err);
    return res.status(500).json({ message: "Greška pri spremanju objave.", error: err.message });
  }
};

export const getSpremljeneObjave = async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ message: "Niste autorizirani." });

    const korisnik = await Korisnik.findById(req.user._id)
      .populate({
        path: "spremljeneObjave",
        populate: [{ path: "autor", select: "ime" }]
      });

    if (!korisnik) return res.status(404).json({ message: "Korisnik ne postoji." });

    const result = (korisnik.spremljeneObjave || []).map(o => ({
      _id: o._id,
      naslov: o.naslov,
      sadrzaj: o.sadrzaj,
      tip: o.tip,
      autor: o.autor?.ime || "Nepoznato",
      odsjek: o.odsjek,
      datum: o.datum
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("getSpremljeneObjave error:", err);
    return res.status(500).json({ message: "Greška dohvaćanja spremljenih objava.", error: err.message });
  }
};
