import axios from "axios";
import * as cheerio from "cheerio";
import Vijest from "../models/Vijest.js";

export async function fetchFFOSNews() {
  try {
    const { data } = await axios.get("https://www.ffos.unios.hr/category/obavijesti/");
    const $ = cheerio.load(data);

    $(".entry-title a").each(async (_, el) => {
      const naslov = $(el).text().trim();
      const link = $(el).attr("href");
      const izvor = "ffos.hr";

      if (!naslov || !link) return;

      const postoji = await Vijest.findOne({ link });
      if (!postoji) {
        await Vijest.create({ naslov, izvor, link });
        console.log("✅ Nova vijest dodana:", naslov);
      }
    });
  } catch (err) {
    console.error("❌ Greška pri dohvaćanju vijesti:", err.message);
  }
}
