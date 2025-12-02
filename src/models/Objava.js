import mongoose from "mongoose";

const objavaSchema = new mongoose.Schema(
  {
    naslov: { type: String, required: true },
    sadrzaj: { type: String, required: true },
    tip: {
      type: String,
      enum: ["radionice", "kvizovi", "projekti", "natječaji", "ostalo"],
      default: "ostalo",
    },
    odsjek: { type: String },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "Korisnik" },
    status: {
      type: String,
      enum: ["na čekanju", "odobreno", "odbijeno"],
      default: "na čekanju",
    },
    datum: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ INDEXI za brže upite
objavaSchema.index({ status: 1, datum: -1 }); // Admin panel - sortiranje po statusu i datumu
objavaSchema.index({ tip: 1, odsjek: 1 }); // Filtriranje po tipu i odsjeku
objavaSchema.index({ naslov: "text", sadrzaj: "text" }); // Full-text search
objavaSchema.index({ autor: 1 }); // Pretraga objava po autoru
objavaSchema.index({ views: -1 }); // Sortiranje po popularnosti

export default mongoose.model("Objava", objavaSchema);
