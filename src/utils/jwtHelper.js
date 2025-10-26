import jwt from "jsonwebtoken";

const tajna = process.env.JWT_SECRET || "tajna_lozinka";

export const generirajToken = (korisnik) => {
  return jwt.sign(
    { id: korisnik._id, uloga: korisnik.uloga },
    tajna,
    { expiresIn: "7d" }
  );
};

export const provjeriToken = (token) => jwt.verify(token, tajna);
