import { zapocniRazgovor, posaljiPoruku, dohvatiPoruke } from "../services/inboxService.js";
import { dohvatiSveRazgovore } from "../services/inboxService.js";


export const zapocniRazgovorController = async (req, res) => {
  try {
    const { korisnici } = req.body; // [id1, id2]
    const razgovor = await zapocniRazgovor(korisnici);
    res.json(razgovor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const posaljiPorukuController = async (req, res) => {
  try {
    const { razgovorId, posiljatelj, sadrzaj } = req.body;
    const poruka = await posaljiPoruku(razgovorId, posiljatelj, sadrzaj);
    res.status(201).json(poruka);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const dohvatiPorukeController = async (req, res) => {
  try {
    const { razgovorId } = req.params;
    const poruke = await dohvatiPoruke(razgovorId);
    res.json(poruke);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const dohvatiSveRazgovoreController = async (req, res) => {
  try {
    const razgovori = await dohvatiSveRazgovore();
    res.json(razgovori);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};