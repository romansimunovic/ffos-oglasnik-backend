import * as oglasService from "../services/oglasService.js";
import { OglasDTO } from "../dto/OglasDTO.js";

export const getAllOglasi = async (req, res, next) => {
  try {
    const oglasi = await oglasService.getAll();
    res.json(oglasi.map(o => OglasDTO(o)));
  } catch (err) { next(err); }
};

export const createOglas = async (req, res, next) => {
  try {
    const novi = await oglasService.create(req.body);
    res.status(201).json(OglasDTO(novi));
  } catch (err) { next(err); }
};

export const deleteOglas = async (req, res, next) => {
  try {
    await oglasService.remove(req.params.id);
    res.json({ message: "Oglas obrisan" });
  } catch (err) { next(err); }
};

export const updateOglas = async (req, res, next) => {
  try {
    const azuriran = await oglasService.update(req.params.id, req.body);
    res.json(OglasDTO(azuriran));
  } catch (err) { next(err); }
};
