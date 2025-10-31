import Objava from "../models/Objava.js";

// testni sync (umjesto stvarnog scrapanja weba)
export const syncFFOSVijesti = async (req, res) => {
  try {
    const testneVijesti = [
      {
        naslov: "FFOS dobio novu knjižnicu",
        sadrzaj: "Otvorena moderna knjižnica s više digitalnih resursa.",
        tip: "projekti",
        autor: "FFOS Web",
        status: "odobreno",
      },
      {
        naslov: "Radionica o akademskom pisanju",
        sadrzaj: "Studenti mogu sudjelovati u radionici u svibnju.",
        tip: "radionice",
        autor: "Centar za učenje",
        status: "odobreno",
      },
    ];

    await Objava.insertMany(testneVijesti);
    res.status(201).json({ message: "FFOS vijesti uspješno uvezene." });
  } catch (err) {
    res.status(500).json({
      message: "Greška pri uvozu vijesti.",
      error: err.message,
    });
  }
};
