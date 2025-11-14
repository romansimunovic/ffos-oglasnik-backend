import * as objavaService from "../services/objavaService.js";

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

// Dohvati objave za admina (na čekanju)
export const getPendingObjave = async (req, res) => {
  try {
    const objave = await objavaService.getPendingObjave();
    res.status(200).json(objave);
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju admin objava.", error: err.message });
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
