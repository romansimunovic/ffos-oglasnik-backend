// src/controllers/objavaController.js
import Objava from "../models/Objava.js";
import Korisnik from "../models/Korisnik.js";
import { ObjavaDTO } from "../dto/ObjavaDTO.js";

// Dohvati sve odobrene objave (user view)
export const getObjave = async (req, res) => {
  try {
    const { tip = "sve", odsjekId, sortBy = "newest" } = req.query;
    const query = { status: "odobreno" };
    if (tip && tip !== "sve") query.tip = tip;
    if (odsjekId) query.odsjek = odsjekId;
    const sort = sortBy === "oldest" ? { datum: 1 } : { datum: -1 };

    const objave = await Objava.find(query)
      .populate("autor", "ime avatar")
      .sort(sort);

    res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Greška pri dohvaćanju objava.", error: err.message });
  }
};

// Detalj objave po ID-u
export const getObjavaById = async (req, res) => {
  try {
    const { id } = req.params;
    const objava = await Objava.findById(id)
      .populate("autor", "ime avatar")
      .populate("odsjek", "naziv");
    if (!objava)
      return res.status(404).json({ message: "Objava nije pronađena." });
    res.status(200).json(ObjavaDTO(objava));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Greška pri dohvaćanju objave.", error: err.message });
  }
};

// Kreiraj novu objavu (student → adminu na odobrenje)
export const createObjava = async (req, res) => {
  try {
    const { naslov, sadrzaj, tip, odsjek } = req.body;
    if (!naslov || !sadrzaj || !tip || !odsjek) {
      return res.status(400).json({ message: "Sva polja su obavezna." });
    }

    const novaObjava = new Objava({
      naslov: naslov.trim(),
      sadrzaj: sadrzaj.trim(),
      tip,
      odsjek,
      autor: req.user._id,
      status: "na čekanju",
      datum: new Date(),
    });

    const saved = await novaObjava.save();
    const full = await Objava.findById(saved._id)
      .populate("autor", "ime avatar")
      .populate("odsjek", "naziv");

    res.status(201).json(ObjavaDTO(full));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Greška pri slanju objave.", error: err.message });
  }
};

// Dohvati sve objave za admin panel
export const getAllObjaveAdmin = async (req, res) => {
  try {
    const objave = await Objava.find({})
      .populate("autor", "ime email uloga avatar")
      .populate("odsjek", "naziv")
      .sort({ datum: -1 });

    res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    res.status(500).json({
      message: "Greška pri dohvaćanju admin objava.",
      error: err.message,
    });
  }
};

// Dohvati objave prijavljenog korisnika (Moje objave)
export const getMojeObjave = async (req, res) => {
  try {
    const objave = await Objava.find({ autor: req.user._id })
      .populate("odsjek", "naziv")
      .sort({ datum: -1 });
    res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    res.status(500).json({
      message: "Greška pri dohvaćanju mojih objava.",
      error: err.message,
    });
  }
};

// Admin: promjena statusa objave
export const updateObjavaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) {
      return res
        .status(400)
        .json({ message: "ID i status su obavezni." });
    }

    const updated = await Objava.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("autor", "ime avatar")
      .populate("odsjek", "naziv");

    if (!updated)
      return res.status(404).json({ message: "Objava nije pronađena." });

    res.status(200).json(ObjavaDTO(updated));
  } catch (err) {
    res.status(500).json({
      message: "Greška pri ažuriranju statusa objave.",
      error: err.message,
    });
  }
};

// Admin: brisanje objave
export const deleteObjava = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Objava.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Objava nije pronađena." });
    res.status(200).json({ message: "Objava obrisana." });
  } catch (err) {
    res.status(500).json({
      message: "Greška pri brisanju objave.",
      error: err.message,
    });
  }
};

// Objave određenog korisnika (javni profil)
export const getObjaveByAutor = async (req, res) => {
  try {
    const { autorId } = req.params;
    if (!autorId) {
      return res.status(400).json({ message: "Nedostaje ID autora." });
    }

    const autorPostoji = await Korisnik.findById(autorId).select("_id");
    if (!autorPostoji) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    const objave = await Objava.find({ autor: autorId, status: "odobreno" })
      .populate("odsjek", "naziv")
      .populate("autor", "ime avatar")
      .sort({ datum: -1 });

    return res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    console.error("getObjaveByAutor error:", err);
    return res.status(500).json({
      message: "Greška pri dohvaćanju objava autora.",
      error: err.message,
    });
  }
};
