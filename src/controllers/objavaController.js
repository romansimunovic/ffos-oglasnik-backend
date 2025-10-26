import * as objavaService from "../services/objavaService.js";

export const getObjave = async (req, res) => {
  try {
    const tip = req.query.tip || "sve";
    const objave = await objavaService.getAllObjave(tip);
    res.status(200).json(objave);
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju objava", error: err.message });
  }
};

export const createObjava = async (req, res) => {
  try {
    const novaObjava = await objavaService.createObjava(req.body);
    res.status(201).json(novaObjava);
  } catch (err) {
    res.status(500).json({ message: "Greška pri stvaranju objave", error: err.message });
  }
};

export const deleteObjava = async (req, res) => {
  try {
    await objavaService.deleteObjava(req.params.id);
    res.status(200).json({ message: "Objava obrisana" });
  } catch (err) {
    res.status(500).json({ message: "Greška pri brisanju objave", error: err.message });
  }
};
