import Korisnik from "../models/Korisnik.js";
import jwt from "jsonwebtoken";

export const registracija = async (req, res) => {
  try {
    const korisnik = new Korisnik(req.body);
    await korisnik.save();
    res.status(201).json({ message: "Registracija uspješna" });
  } catch (err) {
    res.status(400).json({ message: "Greška pri registraciji", error: err.message });
  }
};

export const prijava = async (req, res) => {
  try {
    const { email, lozinka } = req.body;
    const korisnik = await Korisnik.findOne({ email });
    if (!korisnik) return res.status(404).json({ message: "Korisnik ne postoji" });

    const tocno = await korisnik.provjeriLozinku(lozinka);
    if (!tocno) return res.status(401).json({ message: "Pogrešna lozinka" });

    const token = jwt.sign(
      { id: korisnik._id, uloga: korisnik.uloga },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, korisnik: { ime: korisnik.ime, uloga: korisnik.uloga } });
  } catch (err) {
    res.status(500).json({ message: "Greška pri prijavi", error: err.message });
  }
};
