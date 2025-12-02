import mongoose from "mongoose";

const korisnikSchema = new mongoose.Schema(
  {
    ime: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    lozinka: { type: String, required: true },
    uloga: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String },
    spremljeneObjave: [{ type: mongoose.Schema.Types.ObjectId, ref: "Objava" }],
  },
  { timestamps: true }
);

// ✅ INDEXI
korisnikSchema.index({ email: 1 }); // Brza pretraga po emailu (login)
korisnikSchema.index({ uloga: 1 }); // Admin upiti

export default mongoose.model("Korisnik", korisnikSchema);
