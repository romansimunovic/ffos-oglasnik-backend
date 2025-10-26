import Razgovor from "../models/Razgovor.js";
import Poruka from "../models/Poruka.js";

export const zapocniRazgovor = async (user1, user2) => {
  let razgovor = await Razgovor.findOne({ sudionici: { $all: [user1, user2] } });
  if (!razgovor) {
    razgovor = new Razgovor({ sudionici: [user1, user2] });
    await razgovor.save();
  }
  return razgovor;
};

export const posaljiPoruku = async (razgovorId, posiljatelj, tekst) => {
  const poruka = new Poruka({ razgovorId, posiljatelj, tekst });
  await poruka.save();
  return poruka;
};

export const dohvatiPoruke = async (razgovorId) => {
  return await Poruka.find({ razgovorId }).populate("posiljatelj", "ime email");
};
