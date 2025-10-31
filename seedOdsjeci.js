import mongoose from "mongoose";
import dotenv from "dotenv";
import Odsjek from "./src/models/Odsjek.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Spojeno na bazu:", mongoose.connection.name);

    await Odsjek.deleteMany({}); // očisti stare zapise

    const odsjekData = [
      { naziv: "Odsjek za hrvatski jezik i književnost" },
      { naziv: "Odsjek za povijest" },
      { naziv: "Odsjek za informacijske znanosti" },
      { naziv: "Odsjek za engleski jezik i književnost" },
      { naziv: "Odsjek za njemački jezik i književnost" },
      { naziv: "Odsjek za pedagogiju" },
      { naziv: "Odsjek za filozofiju" },
      { naziv: "Odsjek za psihologiju" },
      { naziv: "Odsjek za sociologiju" },
      { naziv: "Katedra za mađarski jezik i književnost" },
      { naziv: "Katedra za povijest umjetnosti" },
    ];

    await Odsjek.insertMany(odsjekData);

    console.log(`✅ Dodano ${odsjekData.length} odsjeka.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Greška pri dodavanju odsjeka:", err);
    process.exit(1);
  }
};

run();
