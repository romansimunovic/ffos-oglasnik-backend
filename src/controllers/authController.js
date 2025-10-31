import Korisnik from "../models/Korisnik.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🔹 Registracija korisnika
export const register = async (req, res) => {
  try {
    const { ime, email, lozinka, uloga } = req.body;

    // Dozvoli samo FFOS domenu
    if (!email.endsWith("@ffos.hr")) {
      return res.status(400).json({ message: "Dozvoljene su samo @ffos.hr adrese." });
    }

    // Provjeri postoji li korisnik
    const postoji = await Korisnik.findOne({ email });
    if (postoji) {
      return res.status(400).json({ message: "Korisnik već postoji." });
    }

    // Hash lozinke
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(lozinka, salt);

    // Kreiraj novog korisnika
    const novi = await Korisnik.create({
      ime,
      email,
      lozinka: hashedPassword,
      uloga: uloga || "student",
    });

    res.status(201).json({
      message: "Registracija uspješna.",
      user: { id: novi._id, ime: novi.ime, email: novi.email, uloga: novi.uloga },
    });
  } catch (err) {
    res.status(500).json({ message: "Greška pri registraciji.", error: err.message });
  }
};

// 🔹 Prijava korisnika
export const login = async (req, res) => {
  try {
    const { email, lozinka } = req.body;

    const user = await Korisnik.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    // Provjeri lozinku
    const isMatch = await bcrypt.compare(lozinka, user.lozinka);
    if (!isMatch) {
      return res.status(400).json({ message: "Neispravna lozinka." });
    }

    // Generiraj token
    const token = jwt.sign(
      { id: user._id, uloga: user.uloga },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      message: "Prijava uspješna.",
      token,
      user: { id: user._id, ime: user.ime, email: user.email, uloga: user.uloga },
    });
  } catch (err) {
    res.status(500).json({ message: "Greška pri prijavi.", error: err.message });
  }
};
