import Objava from "../models/Objava.js";
import { ObjavaDTO } from "../dto/ObjavaDTO.js";

// Dohvat objava (filtriranje, sort, populacija)
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

// Detalj pojedinačne objave
export const getObjavaById = async (id) => {
  if (!id) return null;
  const objava = await Objava.findById(id).populate("odsjek", "naziv");
  return objava ? ObjavaDTO(objava) : null;
};

// Kreiranje objave
export const createObjava = async (data) => {
  const novaObjava = new Objava({
    naslov: data.naslov?.trim(),
    sadrzaj: data.sadrzaj?.trim(),
    tip: data.tip || "ostalo",
    odsjek: data.odsjek || null,
    autor: data.autor || "Student",
    status: "na čekanju",
    datum: new Date(),
    platforma: data.platforma || "web",
    link: data.link || null,
  });

  const saved = await novaObjava.save();
  return ObjavaDTO(await saved.populate("odsjek", "naziv"));
};

// Ažuriranje statusa
export const updateObjavaStatus = async (id, status) => {
  if (!id || !status) return null;
  const updated = await Objava.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("odsjek", "naziv");
  return updated ? ObjavaDTO(updated) : null;
};

// Dohvat svih objava na čekanju
export const getPendingObjave = async () => {
  const objave = await Objava.find({ status: "na čekanju" }).populate("odsjek", "naziv").sort({ datum: -1 });
  return objave.map((o) => ObjavaDTO(o));
};


// Brisanje objave
export const deleteObjava = async (id) => {
  if (!id) return null;
  const deleted = await Objava.findByIdAndDelete(id);
  return deleted ? ObjavaDTO(deleted) : null;
};
