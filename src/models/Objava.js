import mongoose from "mongoose";

const objavaSchema = new mongoose.Schema({
  naslov: { type: String, required: true, trim: true },
  sadrzaj: { type: String, required: true, trim: true }, // ← Važno: sadrzaj, ne sadržaj!
  tip: { 
    type: String, 
    enum: ["radionice", "kvizovi", "projekti", "natječaji", "ostalo"],
    required: true 
  },
  odsjek: { 
    type: String, // ili mongoose.Schema.Types.ObjectId ako je reference
    required: true 
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Korisnik",
    required: true,
  },
  status: { 
    type: String, 
    enum: ["na čekanju", "odobreno", "odbijeno"],
    default: "na čekanju" 
  },
  datum: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  urgentno: { type: Boolean, default: false },
});

// ✅ Text index za search
objavaSchema.index({ naslov: "text", sadrzaj: "text" });

export default mongoose.model("Objava", objavaSchema);
