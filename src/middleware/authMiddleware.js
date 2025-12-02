import jwt from "jsonwebtoken";
import Korisnik from "../models/Korisnik.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Nema tokena. Morate biti prijavljeni." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const korisnik = await Korisnik.findById(decoded.id);

    if (!korisnik) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    req.user = {
      _id: korisnik._id,
      id: korisnik._id,
      ime: korisnik.ime,
      email: korisnik.email,
      uloga: korisnik.uloga,
      odsjek: korisnik.odsjek,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token nije validan.", error: err.message });
  }
};

// ✅ SAMO ADMIN MOŽE
export const protectAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Morate biti prijavljeni." });
  }

  if (req.user.uloga !== "admin") {
    return res.status(403).json({ message: "Samo administratori mogu pristupiti ovoj ruti." });
  }

  next();
};

// ✅ SAMO STUDENT (ne-admin)
export const protectStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Morate biti prijavljeni." });
  }

  if (req.user.uloga === "admin") {
    return res.status(403).json({ message: "Administratori ne mogu izvršiti ovu akciju." });
  }

  next();
};
