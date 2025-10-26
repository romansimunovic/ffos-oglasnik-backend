import Objavа from "../models/Objava.js";
import { ObjavaDTO } from "../dto/ObjavaDTO.js";

export const getAllObjave = async (filterTip) => {
  const query = filterTip && filterTip !== "sve" ? { tip: filterTip } : {};
  const objave = await Objavа.find(query).sort({ datum: -1 });
  return objave.map((o) => ObjavaDTO(o));
};

export const createObjava = async (data) => {
  const novaObjava = new Objavа(data);
  const saved = await novaObjava.save();
  return ObjavaDTO(saved);
};

export const deleteObjava = async (id) => {
  return await Objavа.findByIdAndDelete(id);
};
