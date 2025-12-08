import mongoose from "mongoose";

const obavijestSchema = new mongoose.Schema({
  korisnik: { type: mongoose.Schema.Types.ObjectId, ref: "Korisnik", required: true }, // primatelj
  title: { type: String, required: true },
  message: { type: String },
  objavaId: { type: mongoose.Schema.Types.ObjectId, ref: "Objava", default: null },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Obavijest", obavijestSchema);
