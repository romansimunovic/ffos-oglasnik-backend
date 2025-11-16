import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const korisnikSchema = new mongoose.Schema(
  {
    ime: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    lozinka: { type: String, required: true },
    uloga: { type: String, enum: ["student", "admin"], default: "student" },

    spremljeneObjave: [{ type: mongoose.Schema.Types.ObjectId, ref: "Objava" }],
  },
  { timestamps: true }
);

korisnikSchema.pre("save", async function (next) {
  if (!this.isModified("lozinka")) return next();
  const salt = await bcrypt.genSalt(10);
  this.lozinka = await bcrypt.hash(this.lozinka, salt);
  next();
});

korisnikSchema.methods.provjeriLozinku = async function (kandidatLozinka) {
  return await bcrypt.compare(kandidatLozinka, this.lozinka);
};

export default mongoose.model("Korisnik", korisnikSchema);
