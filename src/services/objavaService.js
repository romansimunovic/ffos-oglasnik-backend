import Objava from "../models/Objava.js";
import { ObjavaDTO } from "../dto/ObjavaDTO.js";

// dohvat objava po tipu / odjelu / sortiranju
export const getAllObjave = async (tip = "sve", odsjekId, sortBy = "newest") => {
  const query = { status: "odobreno" };

  if (tip && tip !== "sve") query.tip = tip;
  if (odsjekId) query.odsjek = odsjekId;

  const sort = sortBy === "oldest" ? { datum: 1 } : { datum: -1 };

  const objave = await Objava.find(query)
    .populate("odsjek", "naziv")
    .sort(sort);

  return objave.map((o) => ObjavaDTO(o));
};

// dohvat svih objava (za admin panel)
export const getSveObjave = async () => {
  const objave = await Objava.find()
    .populate("odsjek", "naziv")
    .sort({ datum: -1 });
  return objave.map((o) => ObjavaDTO(o));
};

// stvaranje nove objave
export const createObjava = async (data) => {
  const novaObjava = new Objava({
    naslov: data.naslov?.trim(),
    sadrzaj: data.sadrzaj?.trim(),
    tip: data.tip || "ostalo",
    odsjek: data.odsjek || null,
    autor: data.autor || "Student",
    status: "na čekanju",
    datum: new Date(),
  });

  const saved = await novaObjava.save();
  return ObjavaDTO(saved);
};

// ažuriranje statusa objave
export const updateObjavaStatus = async (id, status) => {
  if (!id || !status) return null;

  const updated = await Objava.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("odsjek", "naziv");

  return updated ? ObjavaDTO(updated) : null;
};

// brisanje objave
export const deleteObjava = async (id) => {
  if (!id) return null;
  const deleted = await Objava.findByIdAndDelete(id);
  return deleted ? ObjavaDTO(deleted) : null;
};
