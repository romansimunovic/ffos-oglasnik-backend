import Objava from "../models/Objava.js";
import User from "../models/Korisnik.js";
import { ObjavaDTO } from "../dto/ObjavaDTO.js";

// Dohvati sve odobrene objave, filtriraj po tipu/odsjeku/sortiranju (user view)
export const getObjave = async (req, res) => {
  try {
    const { tip = "sve", odsjekId, sortBy = "newest" } = req.query;
    const query = { status: "odobreno" };
    if (tip && tip !== "sve") query.tip = tip;
    if (odsjekId) query.odsjek = odsjekId;
    const sort = sortBy === "oldest" ? { datum: 1 } : { datum: -1 };

    const objave = await Objava.find(query)
      .populate("autor", "ime")
      .populate("odsjek", "naziv")
      .sort(sort);

    res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju objava.", error: err.message });
  }
};

// Detalj objave po ID-u
export const getObjavaById = async (req, res) => {
  try {
    const { id } = req.params;
    const objava = await Objava.findById(id)
      .populate("autor", "ime")
      .populate("odsjek", "naziv");
    if (!objava) return res.status(404).json({ message: "Objava nije pronađena." });
    res.status(200).json(ObjavaDTO(objava));
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju objave.", error: err.message });
  }
};

// Kreiraj novu objavu (student, ide adminu na odobrenje)
export const createObjava = async (req, res) => {
  try {
    const { naslov, sadrzaj, tip, odsjek } = req.body;
    if (!naslov || !sadrzaj || !tip || !odsjek)
      return res.status(400).json({ message: "Sva polja su obavezna." });

    const novaObjava = new Objava({
      naslov: naslov.trim(),
      sadrzaj: sadrzaj.trim(),
      tip,
      odsjek,
      autor: req.user._id,
      status: "na čekanju",
      datum: new Date()
    });

    const saved = await novaObjava.save();
    // Dohvati popunjenog autora (ime)
    const full = await Objava.findById(saved._id)
      .populate("autor", "ime")
      .populate("odsjek", "naziv");
    res.status(201).json(ObjavaDTO(full));
  } catch (err) {
    res.status(500).json({ message: "Greška pri slanju objave.", error: err.message });
  }
};

// Dohvati sve objave za admin panel
export const getAllObjaveAdmin = async (req, res) => {
  try {
    const objave = await Objava.find({})
      .populate("autor", "ime email uloga")
      .populate("odsjek", "naziv")
      .sort({ datum: -1 });
    res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju admin objava.", error: err.message });
  }
};

// Dohvati objave određenog korisnika (profil - Moje objave)
export const getMojeObjave = async (req, res) => {
  try {
    const objave = await Objava.find({ autor: req.user._id })
      .populate("odsjek", "naziv")
      .sort({ datum: -1 });
    res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju mojih objava.", error: err.message });
  }
};

// Admin: promjena statusa objave
export const updateObjavaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status)
      return res.status(400).json({ message: "ID i status su obavezni." });

    const updated = await Objava.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("autor", "ime")
      .populate("odsjek", "naziv");
    if (!updated) return res.status(404).json({ message: "Objava nije pronađena." });

    res.status(200).json(ObjavaDTO(updated));
  } catch (err) {
    res.status(500).json({ message: "Greška pri ažuriranju statusa objave.", error: err.message });
  }
};

// Admin: brisanje objave
export const deleteObjava = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Objava.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Objava nije pronađena." });
    res.status(200).json({ message: "Objava obrisana." });
  } catch (err) {
    res.status(500).json({ message: "Greška pri brisanju objave.", error: err.message });
  }
};

// Dohvati spremljene objave korisnika
export const getSpremljeneObjave = async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.user._id)
      .populate({
        path: "spremljeneObjave",
        populate: [
          { path: "odsjek", select: "naziv" },
          { path: "autor", select: "ime" }
        ]
      });
    if (!korisnik) return res.status(404).json([]);

    const result = korisnik.spremljeneObjave.map(ObjavaDTO);
    res.status(200).json(result);
  } catch (err) {
    console.error("Spremljene objave error:", err); // Dodaj ovo!
    res.status(500).json({ message: "Greška dohvaćanja spremljenih objava.", error: err.message });
  }
};

