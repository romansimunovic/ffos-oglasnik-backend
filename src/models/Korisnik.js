import mongoose from "mongoose";

const korisnikSchema = new mongoose.Schema({
  ime: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  lozinka: { type: String, required: true },
  uloga: { type: String, enum: ["student", "admin"], default: "student" }
}, { timestamps: true });

export default mongoose.model("Korisnik", korisnikSchema);
