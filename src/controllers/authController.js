import Korisnik from "../models/Korisnik.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const DOMAIN = "@ffos.hr";

const createToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { ime, email, lozinka, uloga = "user" } = req.body;
    if (!ime || !email || !lozinka) return res.status(400).json({ message: "Ime, email i lozinka su obavezni." });

    // domain check
    if (!email.endsWith(DOMAIN)) {
      return res.status(403).json({ message: `Registracija je dozvoljena samo sa ${DOMAIN} e-mail adresom.` });
    }

    // password policy (server-side)
    const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regExp.test(lozinka)) {
      return res.status(400).json({ message: "Lozinka mora imati najmanje 8 znakova, jedno malo i jedno veliko slovo te broj." });
    }

    const exists = await Korisnik.findOne({ email });
    if (exists) return res.status(409).json({ message: "Korisnik s tim emailom već postoji." });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(lozinka, salt);

    const novi = await Korisnik.create({
      ime,
      email,
      lozinka: hashed,
      uloga
    });

    const token = createToken(novi._id);

    return res.status(201).json({
      message: "Korisnik kreiran.",
      token,
      user: { _id: novi._id, ime: novi.ime, email: novi.email, uloga: novi.uloga }
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    if (err.code === 11000 && err.keyValue?.email) {
      return res.status(409).json({ message: "Email već zauzet." });
    }
    return res.status(500).json({ message: "Greška servera pri registraciji.", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, lozinka } = req.body;
    if (!email || !lozinka) return res.status(400).json({ message: "Email i lozinka su obavezni." });

    const user = await Korisnik.findOne({ email }).select("+lozinka");
    if (!user) return res.status(401).json({ message: "Pogrešan email ili lozinka." });

    const match = await bcrypt.compare(lozinka, user.lozinka);
    if (!match) return res.status(401).json({ message: "Pogrešan email ili lozinka." });

    const token = createToken(user._id);
    return res.status(200).json({ token, user: { _id: user._id, ime: user.ime, email: user.email, uloga: user.uloga } });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Greška servera pri loginu.", error: err.message });
  }
};
