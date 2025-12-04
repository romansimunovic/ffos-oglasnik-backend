import Korisnik from "../models/Korisnik.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const DOMAIN = "@ffos.hr";

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // za 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const register = async (req, res) => {
  try {
    const { ime, email, lozinka, uloga = "user" } = req.body;

    if (!ime || !email || !lozinka) {
      return res
        .status(400)
        .json({ message: "Ime, email i lozinka su obavezni." });
    }

    if (!email.endsWith(DOMAIN)) {
      return res.status(403).json({
        message: `Registracija je dozvoljena samo sa ${DOMAIN} e-mail adresom.`,
      });
    }

    const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regExp.test(lozinka)) {
      return res.status(400).json({
        message:
          "Lozinka mora imati najmanje 8 znakova, jedno malo i jedno veliko slovo te broj.",
      });
    }

    const exists = await Korisnik.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Korisnik s tim emailom već postoji." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(lozinka, salt);

    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const novi = await Korisnik.create({
      ime,
      email,
      lozinka: hashed,
      uloga,
      isVerified: false,
      verificationCode: code,
      verificationExpires: expires,
    });

    try {
      await transporter.sendMail({
        from: `"FFOS Oglasnik" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "FFOS Oglasnik - verifikacijski kod",
        text: `Tvoj verifikacijski kod je: ${code}`,
        html: `<p>Pozdrav ${ime},</p>
               <p>Tvoj verifikacijski kod za FFOS Oglasnik je:</p>
               <h2>${code}</h2>
               <p>Kod vrijedi 15 minuta.</p>`,
      });
    } catch (mailErr) {
      console.error("MAIL SEND ERROR:", mailErr);
    }

    return res.status(201).json({
      message:
        "Korisnik kreiran. Provjerite e-mail i unesite verifikacijski kod.",
       devCode: code,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    if (err.code === 11000 && err.keyValue?.email) {
      return res.status(409).json({ message: "Email već zauzet." });
    }
    return res.status(500).json({
      message: "Greška servera pri registraciji.",
      error: err.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Email i kod su obavezni." });
    }

    const user = await Korisnik.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Korisnik ne postoji." });

    if (user.isVerified) {
      return res.status(400).json({ message: "Korisnik je već verificiran." });
    }

    if (
      !user.verificationCode ||
      user.verificationCode !== code ||
      !user.verificationExpires ||
      user.verificationExpires < new Date()
    ) {
      return res.status(400).json({ message: "Neispravan ili istekao kod." });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    const token = createToken(user._id);

    return res.status(200).json({
      message: "Email uspješno verificiran.",
      token,
      user: {
        _id: user._id,
        ime: user.ime,
        email: user.email,
        uloga: user.uloga,
      },
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return res.status(500).json({
      message: "Greška servera pri verifikaciji.",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, lozinka } = req.body;
    if (!email || !lozinka) {
      return res
        .status(400)
        .json({ message: "Email i lozinka su obavezni." });
    }

    const user = await Korisnik.findOne({ email }).select("+lozinka");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Pogrešan email ili lozinka." });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Prije prijave morate potvrditi email." });
    }

    const match = await bcrypt.compare(lozinka, user.lozinka);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Pogrešan email ili lozinka." });
    }

    const token = createToken(user._id);
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        ime: user.ime,
        email: user.email,
        uloga: user.uloga,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Greška servera pri loginu.",
      error: err.message,
    });
  }
};
