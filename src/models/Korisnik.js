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

// hash prije spremanja (radi samo kod create/save)
korisnikSchema.pre("save", async function (next) {
  if (!this.isModified("lozinka")) return next();
  const salt = await bcrypt.genSalt(10);
  this.lozinka = await bcrypt.hash(this.lozinka, salt);
  next();
});

export default mongoose.model("Korisnik", korisnikSchema);
