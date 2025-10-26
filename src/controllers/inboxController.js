import * as inboxService from "../services/inboxService.js";

export const zapocniRazgovor = async (req, res) => {
  try {
    const { user2 } = req.body;
    const razgovor = await inboxService.zapocniRazgovor(req.user.id, user2);
    res.json(razgovor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const posaljiPoruku = async (req, res) => {
  try {
    const { razgovorId, tekst } = req.body;
    const poruka = await inboxService.posaljiPoruku(razgovorId, req.user.id, tekst);
    res.status(201).json(poruka);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const dohvatiPoruke = async (req, res) => {
  try {
    const { razgovorId } = req.params;
    const poruke = await inboxService.dohvatiPoruke(razgovorId);
    res.json(poruke);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
