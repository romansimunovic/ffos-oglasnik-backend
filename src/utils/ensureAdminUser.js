import bcrypt from "bcryptjs";
import Korisnik from "../models/Korisnik.js";

export const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ffos.hr";
  const adminIme = process.env.ADMIN_NAME || "Administrator";
  const adminLozinka = process.env.ADMIN_PASSWORD || "change-me-now";

  // ako već postoji admin s tim mailom – ništa ne radi
  const postoji = await Korisnik.findOne({ email: adminEmail, uloga: "admin" });
  if (postoji) {
    console.log("✅ Admin već postoji:", adminEmail);
    return;
  }

  const hash = await bcrypt.hash(adminLozinka, 10);

  const admin = await Korisnik.create({
  ime: adminIme,
  email: adminEmail,
  lozinka: hash,
  uloga: "admin",
  odsjek: null,
  isVerified: true,            // ⬅ dodaj
  verificationCode: null,      // opcionalno
  verificationExpires: null,   // opcionalno
});


  console.log("👑 Kreiran početni admin:", admin.email);
};
