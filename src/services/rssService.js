// src/services/rssService.js
import axios from "axios";

export const fetchFFOSVijesti = async () => {
  try {
    console.log("Simulirano dohvaćanje RSS vijesti s FFOS-a...");
    const { data } = await axios.get("https://www.ffos.unios.hr/");
    return data;
  } catch (err) {
    console.error("Greška pri dohvaćanju RSS feeda:", err.message);
    return [];
  }
};
