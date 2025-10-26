import mongoose from "mongoose";

const razgovorSchema = new mongoose.Schema({
  korisnici: [{ type: mongoose.Schema.Types.ObjectId, ref: "Korisnik" }],
  posljednjaPoruka: { type: String },
  azurirano: { type: Date, default: Date.now },
});

export default mongoose.model("Razgovor", razgovorSchema);
