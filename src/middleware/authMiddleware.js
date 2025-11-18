// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import Korisnik from "../models/Korisnik.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) {
      return res.status(401).json({ message: "Nema tokena." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verify error:", err);
      return res.status(401).json({ message: "Nevažeći token." });
    }

    const userId = decoded.id || decoded._id;
    if (!userId) {
      return res.status(401).json({ message: "Token ne sadrži ID korisnika." });
    }

    const user = await Korisnik.findById(userId).select("-lozinka");
    if (!user) {
      return res.status(401).json({ message: "Nevažeći korisnik." });
    }

    // postavimo samo minimalne podatke koje kontroleri trebaju
    req.user = { _id: user._id, ime: user.ime, email: user.email, uloga: user.uloga };

    next();
  } catch (err) {
    console.error("protect middleware error:", err);
    return res.status(500).json({ message: "Greška auth middleware-a." });
  }
};

export const protectAdmin = (req, res, next) => {
  try {
    if (req.user?.uloga === "admin") return next();
    return res.status(403).json({ message: "Pristup zabranjen. Samo admin." });
  } catch (err) {
    console.error("protectAdmin error:", err);
    return res.status(500).json({ message: "Greška u protectAdmin." });
  }
};
