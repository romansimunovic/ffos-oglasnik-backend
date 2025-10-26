import Objava from "../models/Objava.js";
import { ObjavaDTO } from "../dto/ObjavaDTO.js";

// 🔹 Student vidi samo odobrene objave
export const getAllObjave = async (filterTip) => {
  const query =
    filterTip && filterTip !== "sve"
      ? { tip: filterTip, status: "odobreno" }
      : { status: "odobreno" };

  const objave = await Objava.find(query).sort({ datum: -1 });
  return objave.map((o) => ObjavaDTO(o));
};

// 🔹 Admin vidi sve objave
export const getSveObjave = async () => {
  const objave = await Objava.find().sort({ datum: -1 });
  return objave.map((o) => ObjavaDTO(o));
};

// 🔹 Kreiranje nove objave (student)
export const createObjava = async (data) => {
  const novaObjava = new Objava({
    ...data,
    status: "na čekanju",
    datum: new Date(),
  });
  const saved = await novaObjava.save();
  return ObjavaDTO(saved);
};

// 🔹 Ažuriranje statusa objave (admin)
export const updateObjavaStatus = async (id, status) => {
  const updated = await Objava.findByIdAndUpdate(id, { status }, { new: true });
  return ObjavaDTO(updated);
};

// 🔹 Brisanje objave
export const deleteObjava = async (id) => {
  return await Objava.findByIdAndDelete(id);
};
