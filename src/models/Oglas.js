import mongoose from "mongoose";

const oglasSchema = new mongoose.Schema({
  naslov: { type: String, required: true },
  opis: { type: String, required: true },
  kategorija: { type: String, enum: ["događaj", "prodaja", "izgubljeno-nađeno", "studentski život"], required: true },
  kontakt: { type: String },
  slika: { type: String },
  korisnikId: { type: mongoose.Schema.Types.ObjectId, ref: "Korisnik" }
}, { timestamps: true });

export default mongoose.model("Oglas", oglasSchema);
