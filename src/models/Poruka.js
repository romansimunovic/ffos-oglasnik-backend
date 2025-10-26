import mongoose from "mongoose";

const porukaSchema = new mongoose.Schema(
  {
    razgovorId: { type: mongoose.Schema.Types.ObjectId, ref: "Razgovor" },
    posiljatelj: { type: mongoose.Schema.Types.ObjectId, ref: "Korisnik" },
    tekst: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Poruka", porukaSchema);
