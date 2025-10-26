import mongoose from "mongoose";

const objavaSchema = new mongoose.Schema({
  naslov: { type: String, required: true },
  opis: { type: String },
  tip: {
    type: String,
    enum: ["radionica", "kviz", "sastanak", "projekti", "natječaj", "ostalo"],
    required: true
  },
  autor: { type: String },
  datum: { type: Date, default: Date.now },
  link: { type: String },
  aktivna: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Objava", objavaSchema);
