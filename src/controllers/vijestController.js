import * as vijestService from "../services/vijestService.js";
import { VijestDTO } from "../dto/VijestDTO.js";

export const getAllVijesti = async (req, res, next) => {
  try {
    const vijesti = await vijestService.getAll();
    res.json(vijesti.map(v => VijestDTO(v)));
  } catch (err) { next(err); }
};

export const createVijest = async (req, res, next) => {
  try {
    const nova = await vijestService.create(req.body);
    res.status(201).json(VijestDTO(nova));
  } catch (err) { next(err); }
};

export const deleteVijest = async (req, res, next) => {
  try {
    await vijestService.remove(req.params.id);
    res.json({ message: "Vijest obrisana" });
  } catch (err) { next(err); }
};
