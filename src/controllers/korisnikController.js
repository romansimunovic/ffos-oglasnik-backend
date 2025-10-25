import * as korisnikService from "../services/korisnikService.js";
import { KorisnikDTO } from "../dto/KorisnikDTO.js";

export const getAllKorisnici = async (req, res, next) => {
  try {
    const korisnici = await korisnikService.getAll();
    res.json(korisnici.map(k => KorisnikDTO(k)));
  } catch (err) { next(err); }
};

export const createKorisnik = async (req, res, next) => {
  try {
    const novi = await korisnikService.create(req.body);
    res.status(201).json(KorisnikDTO(novi));
  } catch (err) { next(err); }
};

export const deleteKorisnik = async (req, res, next) => {
  try {
    await korisnikService.remove(req.params.id);
    res.json({ message: "Korisnik obrisan" });
  } catch (err) { next(err); }
};
