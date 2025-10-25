import mongoose from "mongoose";

const vijestSchema = new mongoose.Schema({
  naslov: { type: String, required: true },
  opis: { type: String },
  izvor: { type: String, enum: ["ffos.hr", "sz.ffos", "instagram", "facebook"], required: true },
  link: { type: String },
  datum: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Vijest", vijestSchema);
