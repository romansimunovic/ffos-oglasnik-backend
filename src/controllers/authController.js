import Korisnik from "../models/Korisnik.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const issueToken = (korisnik) =>
  jwt.sign({ id: korisnik._id, uloga: korisnik.uloga }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const register = async (req, res) => {
  try {
    const { ime, email, lozinka, uloga = "admin" } = req.body || {};
    if (!ime || !email || !lozinka) return res.status(400).json({ message: "Nedostaju polja" });

    const postoji = await Korisnik.findOne({ email });
    if (postoji) return res.status(409).json({ message: "Email već postoji" });

    const korisnik = await Korisnik.create({ ime, email, lozinka, uloga });
    return res.status(201).json({
      message: "Korisnik registriran",
      korisnik: { id: korisnik._id, ime: korisnik.ime, email: korisnik.email, uloga: korisnik.uloga },
    });
  } catch (e) {
    console.error("❌ register:", e);
    res.status(500).json({ message: "Greška na serveru" });
  }
};

export const login = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: "Nema bodyja" });
    const { email, lozinka } = req.body || {};
    if (!email || !lozinka) return res.status(400).json({ message: "Nedostaje email ili lozinka" });

    const korisnik = await Korisnik.findOne({ email });
    if (!korisnik) return res.status(404).json({ message: "Korisnik nije pronađen" });

    const ok = await bcrypt.compare(lozinka, korisnik.lozinka);
    if (!ok) return res.status(401).json({ message: "Neispravna lozinka" });

    const token = issueToken(korisnik);
    return res.status(200).json({
      token,
      korisnik: { id: korisnik._id, ime: korisnik.ime, email: korisnik.email, uloga: korisnik.uloga },
    });
  } catch (e) {
    console.error("❌ login:", e);
    res.status(500).json({ message: "Greška na serveru" });
  }
};
