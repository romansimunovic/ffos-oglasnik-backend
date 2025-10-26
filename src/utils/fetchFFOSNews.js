import axios from "axios";

export const fetchFFOSNews = async () => {
  try {
    const { data } = await axios.get("https://www.ffos.unios.hr/");
    console.log("Podaci s FFOS-a dohvaćeni (simulacija).");
    return data;
  } catch (err) {
    console.error("Greška pri dohvaćanju FFOS vijesti:", err.message);
    return [];
  }
};
