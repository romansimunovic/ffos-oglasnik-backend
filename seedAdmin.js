import mongoose from "mongoose";
import dotenv from "dotenv";
import Korisnik from "./src/models/Korisnik.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("📦 baza:", mongoose.connection.name);

  await Korisnik.deleteMany({});
  const admin = await Korisnik.create({
    ime: "Admin FFOS",
    email: "admin@ffos.hr",
    lozinka: "admin123",   // bit će hashirano u pre-save hooku
    uloga: "admin",
  });

  console.log("✅ Admin kreiran:", admin.email);
  process.exit(0);
};

run();
