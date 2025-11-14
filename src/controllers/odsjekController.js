import Odsjek from "../models/Odsjek.js";

export const getAllOdsjeci = async (req, res) => {
  try {
    const odsjeci = await Odsjek.find().sort({ naziv: 1 });
    res.json(odsjeci);
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju odsjeka.", error: err.message });
  }
};
