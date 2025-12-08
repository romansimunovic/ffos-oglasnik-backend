import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Korisnik", required: true },
    objavaId: { type: mongoose.Schema.Types.ObjectId, ref: "Objava", default: null },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    meta: { type: mongoose.Schema.Types.Mixed }, // optional payload (npr. reason, adminId...)
  },
  { timestamps: true }
);

// index za brzo dohvaćanje po korisniku
notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
