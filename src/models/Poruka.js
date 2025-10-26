import mongoose from "mongoose";

const porukaSchema = new mongoose.Schema({
  razgovor: { type: mongoose.Schema.Types.ObjectId, ref: "Razgovor", required: true },
  posiljatelj: { type: mongoose.Schema.Types.ObjectId, ref: "Korisnik", required: true },
  sadrzaj: { type: String, required: true },
  vrijeme: { type: Date, default: Date.now },
});

export default mongoose.model("Poruka", porukaSchema);
