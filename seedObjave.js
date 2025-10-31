import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Objava from "./src/models/Objava.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    console.log("📦 Baza:", mongoose.connection.name);

    await Objava.deleteMany({});

    const objave = [
      {
        naslov: "Radionica o etici umjetne inteligencije",
        sadrzaj: "Predavanje i radionica o etičkim izazovima suvremene umjetne inteligencije.",
        autor: "Odsjek za filozofiju",
        datum: new Date("2025-02-15"),
        tip: "radionice",
        platforma: "web",
        status: "odobreno",
      },
      {
        naslov: "Studentski kviz o hrvatskom jeziku",
        sadrzaj: "Kviz znanja povodom Dana hrvatske knjige. Nagrade za najbolje natjecatelje!",
        autor: "Odsjek za hrvatski jezik i književnost",
        datum: new Date("2025-03-01"),
        tip: "kvizovi",
        platforma: "facebook",
        status: "odobreno",
      },
      {
        naslov: "Projekt Digitalna humanistika 2025",
        sadrzaj: "Studenti i profesori rade na digitalnoj bazi hrvatske književnosti.",
        autor: "Odsjek za informacijske znanosti",
        datum: new Date("2025-03-10"),
        tip: "projekti",
        platforma: "web",
        status: "odobreno",
      },
      {
        naslov: "Natječaj za studentske projekte 2025.",
        sadrzaj: "Objavljen je natječaj za sufinanciranje studentskih inicijativa na FFOS-u.",
        autor: "Studentski zbor FFOS",
        datum: new Date("2025-04-05"),
        tip: "natječaji",
        platforma: "web",
        status: "odobreno",
      },
      {
        naslov: "Ljetna škola pisanja i kreativnog izražavanja",
        sadrzaj: "Radionica kreativnog pisanja otvorena za sve studente i zaposlenike FFOS-a.",
        autor: "Centar za cjeloživotno učenje",
        datum: new Date("2025-07-01"),
        tip: "ostalo",
        platforma: "instagram",
        status: "odobreno",
      },
    ];

    await Objava.insertMany(objave);
    console.log(`✅ Uspješno dodano ${objave.length} testnih objava.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Greška pri dodavanju objava:", err);
    process.exit(1);
  }
};

run();
