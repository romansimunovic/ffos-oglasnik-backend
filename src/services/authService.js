import Korisnik from "../models/Korisnik.js";
import { generirajToken } from "../utils/jwtHelper.js";
import { KorisnikDTO } from "../dto/KorisnikDTO.js";

export const registracija = async (data) => {
  const novi = new Korisnik(data);
  await novi.save();
  const token = generirajToken(novi);
  return { korisnik: KorisnikDTO(novi), token };
};

export const prijava = async ({ email, lozinka }) => {
  const korisnik = await Korisnik.findOne({ email });
  if (!korisnik) throw new Error("Korisnik ne postoji.");
  const tocno = await korisnik.provjeriLozinku(lozinka);
  if (!tocno) throw new Error("Pogrešna lozinka.");
  const token = generirajToken(korisnik);
  return { korisnik: KorisnikDTO(korisnik), token };
};
