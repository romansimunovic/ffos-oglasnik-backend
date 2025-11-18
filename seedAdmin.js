// seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Korisnik from "./src/models/Korisnik.js";
import bcrypt from "bcryptjs";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    console.log("Baza:", mongoose.connection.name);

    // opcionalno obriši stare korisnike ili samo admina
    // await Korisnik.deleteMany({}); // OPREZ: briše sve korisnike

    // provjeri postoji li admin
    const exists = await Korisnik.findOne({ email: "admin@ffos.hr" });
    if (exists) {
      console.log("Admin već postoji:", exists.email);
      // Ako želiš resetirati lozinku admina, odkomentiraj dolje:
      // const salt = await bcrypt.genSalt(10);
      // exists.lozinka = await bcrypt.hash("admin123", salt);
      // await exists.save();
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("admin123", salt);

    const admin = await Korisnik.create({
      ime: "Admin FFOS",
      email: "admin@ffos.hr",
      lozinka: hashed,
      uloga: "admin",
    });

    console.log("Admin kreiran:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Greška pri kreiranju admina:", err);
    process.exit(1);
  }
};

run();
