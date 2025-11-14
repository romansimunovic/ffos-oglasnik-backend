import mongoose from "mongoose";

const objavaSchema = new mongoose.Schema({
  naslov: { type: String, required: true },
  sadrzaj: { type: String, required: true },
  tip: { type: String, enum: ["radionice","kvizovi","projekti","natječaji","ostalo"], default: "ostalo" },
  autor: { type: String, default: "Nepoznato" },
  odsjek: { type: String, required: true }, // ili bez required ako nije obavezan
  platforma: { type: String, enum: ["web","facebook","instagram"], default: "web" },
  link: { type: String },
  datum: { type: Date, default: Date.now },
  status: { type: String, enum: ["na čekanju","odobreno","odbijeno"], default: "na čekanju" },
}, { timestamps: true });

export default mongoose.model("Objava", objavaSchema);
