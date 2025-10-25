import Parser from "rss-parser";
import Vijest from "../models/Vijest.js";

const parser = new Parser();

export async function fetchFFOSVijesti() {
  try {
    const feed = await parser.parseURL("https://www.ffos.unios.hr/rss");

    for (const item of feed.items) {
      const postoji = await Vijest.findOne({ link: item.link });
      if (!postoji) {
        await Vijest.create({
          naslov: item.title,
          opis: item.contentSnippet || "",
          izvor: "ffos.hr",
          link: item.link,
          datum: new Date(item.pubDate),
        });
      }
    }

    console.log("Vijesti uspješno dohvaćene i spremljene!");
  } catch (err) {
    console.error("Greška pri dohvaćanju RSS-a:", err);
  }
}
