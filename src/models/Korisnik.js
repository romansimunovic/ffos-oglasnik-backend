import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const korisnikSchema = new mongoose.Schema(
  {
    ime: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    lozinka: { type: String, required: true },
    uloga: { type: String, enum: ["student", "admin"], default: "student" },
  },
  { timestamps: true }
);

// Hash lozinke prije spremanja
korisnikSchema.pre("save", async function (next) {
  if (!this.isModified("lozinka")) return next();
  this.lozinka = await bcrypt.hash(this.lozinka, 10);
  next();
});

// Provjera lozinke
korisnikSchema.methods.provjeriLozinku = function (unesena) {
  return bcrypt.compare(unesena, this.lozinka);
};

export default mongoose.model("Korisnik", korisnikSchema);
