import * as vijestService from "../services/vijestService.js";
import { VijestDTO } from "../dto/VijestDTO.js";
import Vijest from "../models/Vijest.js";

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

// dohvaćanje svih vijesti (sortirane po datumu)
export async function getVijesti(req, res) {
  try {
    const vijesti = await Vijest.find().sort({ datum: -1 });
    res.json(vijesti);
  } catch (err) {
    console.error("Greška pri dohvaćanju vijesti:", err);
    res.status(500).json({ message: "Greška pri dohvaćanju vijesti." });
  }
}



