import express from "express";
import Odsjek from "../models/Odsjek.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const odsjeci = await Odsjek.find().sort({ naziv: 1 });
  res.json(odsjeci);
});

export default router;
