import * as objavaService from "../services/objavaService.js";
import User from "../models/Korisnik.js";

// filtriranje i listanje objava
export const getObjave = async (req, res) => {
  try {
    const { tip = "sve", odsjekId, sortBy = "newest" } = req.query;
    const objave = await objavaService.getAllObjave(tip, odsjekId, sortBy);
    res.status(200).json(objave);
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju objava.", error: err.message });
  }
};

// detalj pojedinačne objave
export const getObjavaById = async (req, res) => {
  try {
    const { id } = req.params;
    const objava = await objavaService.getObjavaById(id);
    if (!objava) return res.status(404).json({ message: "Objava nije pronađena." });
    res.status(200).json(objava);
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju objave.", error: err.message });
  }
};

export const createObjava = async (req, res) => {
  try {
    const novaObjava = await objavaService.createObjava(req.body);
    res.status(201).json(novaObjava);
  } catch (err) {
    res.status(500).json({ message: "Greška pri stvaranju objave.", error: err.message });
  }
};

export const updateObjavaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id) return res.status(400).json({ message: "ID objave je obavezan." });
    if (!status) return res.status(400).json({ message: "Status je obavezan." });
    const updated = await objavaService.updateObjavaStatus(id, status);
    if (!updated) return res.status(404).json({ message: "Objava nije pronađena." });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Greška pri ažuriranju statusa objave.", error: err.message });
  }
};

// Dohvati SVE objave za admin panel
export const getAllObjaveAdmin = async (req, res) => {
  try {
    const objave = await objavaService.getAllObjaveForAdmin();
    res.status(200).json(objave);
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju admin objava.", error: err.message });
  }
};

export const getSpremljeneObjave = async (req, res) => {
  try {
    const userId = req.user.id;
    // Populiraj i odsjek iz objava radi prikaza naziva odsjeka!
    const user = await User.findById(userId)
      .populate({
        path: "spremljeneObjave",
        populate: {
          path: "odsjek",
          select: "naziv"
        }
      });

    if (!user) return res.status(404).json([]);

    const result = user.spremljeneObjave.map(objava => ({
      _id: objava._id,
      naslov: objava.naslov,
      sadrzaj: objava.sadrzaj,
      tip: objava.tip,
      status: objava.status,
      autor: objava.autor,
      odsjek: objava.odsjek
        ? { _id: objava.odsjek._id, naziv: objava.odsjek.naziv }
        : null,
      platforma: objava.platforma,
      link: objava.link || null,
      datum: objava.datum
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Greška.", error: err.message });
  }
};

export const deleteObjava = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID objave je obavezan." });
    const deleted = await objavaService.deleteObjava(id);
    if (!deleted) return res.status(404).json({ message: "Objava nije pronađena." });
    res.status(200).json({ message: "Objava obrisana." });
  } catch (err) {
    res.status(500).json({ message: "Greška pri brisanju objave.", error: err.message });
  }
};
