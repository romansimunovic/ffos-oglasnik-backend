import mongoose from "mongoose";

const korisnikSchema = new mongoose.Schema(
  {
    ime: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    lozinka: { type: String, required: true, select: false },
    uloga: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String },
    spremljeneObjave: [{ type: mongoose.Schema.Types.ObjectId, ref: "Objava" }],

    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    verificationExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

korisnikSchema.index({ email: 1 });
korisnikSchema.index({ uloga: 1 });

export default mongoose.model("Korisnik", korisnikSchema);

