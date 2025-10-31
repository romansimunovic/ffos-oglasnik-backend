import express from "express";
import Odsjek from "../models/Odsjek.js";

const router = express.Router();

// 🔹 Dohvat svih odsjeka
router.get("/", async (req, res) => {
  try {
    const odsjeci = await Odsjek.find().sort({ naziv: 1 });
    res.status(200).json(odsjeci);
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju odsjeka." });
  }
});

export default router;
