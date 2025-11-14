import Korisnik from "../models/Korisnik.js";
import jwt from "jsonwebtoken";

// Registracija
export const register = async (req, res) => {
  try {
    const { ime, email, lozinka } = req.body;
    if (!email.endsWith("@ffos.hr")) {
      return res.status(400).json({ message: "Dozvoljene su samo @ffos.hr adrese." });
    }
    const postoji = await Korisnik.findOne({ email });
    if (postoji) {
      return res.status(400).json({ message: "Korisnik već postoji." });
    }
    const korisnik = new Korisnik({ ime, email, lozinka, uloga: "student" });
    await korisnik.save();

    res.status(201).json({ message: "Registracija uspješna." });
  } catch (err) {
    res.status(500).json({ message: "Greška pri registraciji.", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, lozinka } = req.body;
    const user = await Korisnik.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }
    const isMatch = await user.provjeriLozinku(lozinka);
    if (!isMatch) {
      return res.status(400).json({ message: "Neispravna lozinka." });
    }
    const token = jwt.sign(
      { id: user._id, uloga: user.uloga },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.status(200).json({
      message: "Prijava uspješna.",
      token,
      user: { id: user._id, ime: user.ime, email: user.email, uloga: user.uloga }
    });
  } catch (err) {
    res.status(500).json({ message: "Greška pri prijavi.", error: err.message });
  }
};

// Login za admina
export const adminLogin = async (req, res) => {
  try {
    const { email, lozinka } = req.body;
    const user = await Korisnik.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }
    if (user.uloga !== "admin") {
      return res.status(403).json({ message: "Samo admin može pristupiti." });
    }
    const isMatch = await user.provjeriLozinku(lozinka);
    if (!isMatch) {
      return res.status(400).json({ message: "Neispravna lozinka." });
    }
    const token = jwt.sign(
      { id: user._id, uloga: user.uloga },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.status(200).json({
      message: "Prijava admina uspješna.",
      token,
      user: { id: user._id, ime: user.ime, email: user.email, uloga: user.uloga }
    });
  } catch (err) {
    res.status(500).json({ message: "Greška pri prijavi admina.", error: err.message });
  }
};
