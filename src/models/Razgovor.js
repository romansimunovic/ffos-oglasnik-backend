import mongoose from "mongoose";

const razgovorSchema = new mongoose.Schema(
  {
    sudionici: [{ type: mongoose.Schema.Types.ObjectId, ref: "Korisnik" }],
  },
  { timestamps: true }
);

export default mongoose.model("Razgovor", razgovorSchema);
