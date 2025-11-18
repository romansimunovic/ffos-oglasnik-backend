import mongoose from "mongoose";

const korisnikSchema = new mongoose.Schema({
  ime: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  lozinka: { type: String, required: true, select: false }, // sakrij po defaultu
  uloga: { type: String, default: "user" }, // admin ili user/student
  spremljeneObjave: [{ type: mongoose.Schema.Types.ObjectId, ref: "Objava" }]
}, { timestamps: true });

export default mongoose.model("Korisnik", korisnikSchema);
