import mongoose from "mongoose";

const odsjekSchema = new mongoose.Schema({
  naziv: { type: String, required: true, unique: true },
});

export default mongoose.model("Odsjek", odsjekSchema);
