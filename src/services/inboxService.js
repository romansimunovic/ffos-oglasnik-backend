import Razgovor from "../models/Razgovor.js";
import Poruka from "../models/Poruka.js";

export const zapocniRazgovor = async (korisnici) => {
  const postoji = await Razgovor.findOne({ korisnici: { $all: korisnici } });
  if (postoji) return postoji;

  const novi = new Razgovor({ korisnici });
  await novi.save();
  return novi;
};

export const posaljiPoruku = async (razgovorId, posiljatelj, sadrzaj) => {
  const poruka = new Poruka({ razgovor: razgovorId, posiljatelj, sadrzaj });
  await poruka.save();
  await Razgovor.findByIdAndUpdate(razgovorId, {
    posljednjaPoruka: sadrzaj,
    azurirano: new Date(),
  });
  return poruka;
};

export const dohvatiPoruke = async (razgovorId) => {
  return Poruka.find({ razgovor: razgovorId })
    .populate("posiljatelj", "ime")
    .sort({ vrijeme: 1 });
};

export const dohvatiSveRazgovore = async () => {
  return await Razgovor.find({})
    .populate("korisnici", "ime email")
    .sort({ azurirano: -1 });
};