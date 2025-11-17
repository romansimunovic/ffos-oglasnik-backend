import jwt from "jsonwebtoken";
import Korisnik from "../models/Korisnik.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Nema tokena." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Korisnik.findById(decoded.id).select("-lozinka");
    if (!req.user) return res.status(401).json({ message: "Nevažeći korisnik." });

    next();
  } catch (err) {
    res.status(401).json({ message: "Neautorizirano." });
  }
};

export const protectAdmin = (req, res, next) => {
  if (req.user?.uloga === "admin") return next();
  return res.status(403).json({ message: "Pristup zabranjen. Samo admin." });
};
