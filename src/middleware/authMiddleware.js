import jwt from "jsonwebtoken";
const tajna = process.env.JWT_SECRET || "tajna_lozinka";

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Nema tokena." });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, tajna);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Nevažeći token." });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.uloga !== "admin")
    return res.status(403).json({ message: "Samo admini imaju pristup." });
  next();
};
