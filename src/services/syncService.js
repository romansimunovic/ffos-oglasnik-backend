import axios from "axios";
import { parse } from "node-html-parser";
import Objava from "../models/Objava.js";

export const syncFFOSVijesti = async (req, res) => {
  try {
    const { data } = await axios.get("https://www.ffos.unios.hr/");
    const root = parse(data);
    const vijesti = root.querySelectorAll(".article-title a");

    const noveObjave = await Promise.all(
      vijesti.slice(0, 5).map(async (v) => {
        const naslov = v.text.trim();
        const link = v.getAttribute("href");
        const postoji = await Objava.findOne({ naslov });

        if (!postoji) {
          return await Objava.create({
            naslov,
            sadrzaj: `Pogledaj više na: ${link}`,
            tip: "ostalo",
            autor: "FFOS web",
            status: "odobreno",
          });
        }
      })
    );

    res.status(200).json({
      message: "Sinkronizacija završena",
      noveObjave: noveObjave.filter(Boolean),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri sinkronizaciji FFOS vijesti." });
  }
};
