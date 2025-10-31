import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Korisnik from "./src/models/Korisnik.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    console.log("📦 Baza:", mongoose.connection.name);

    await Korisnik.deleteMany({});

    const admin = await Korisnik.create({
      ime: "Admin FFOS",
      email: "admin@ffos.hr",
      lozinka: "admin123", // ⚠️ bez ručnog bcrypt hashiranja
      uloga: "admin",
    });

    console.log("✅ Admin kreiran:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Greška pri kreiranju admina:", err);
    process.exit(1);
  }
};

run();
