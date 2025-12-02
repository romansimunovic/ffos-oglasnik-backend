// src/controllers/objavaController.js
import Objava from "../models/Objava.js";
import Korisnik from "../models/Korisnik.js";
import { ObjavaDTO } from "../dto/ObjavaDTO.js";

// Dohvati SVE odobrene objave
export const getObjave = async (req, res) => {
  try {
    const { tip = "sve", odsjekId, sortBy = "newest", q = "" } = req.query;
    const query = { status: "odobreno" };
    if (tip && tip !== "sve") query.tip = tip;
    if (odsjekId) query.odsjek = odsjekId;

    let find = Objava.find(query).populate("autor", "ime avatar");
    const sort =
      sortBy === "oldest"
        ? { datum: 1 }
        : sortBy === "views"
        ? { views: -1 }
        : { datum: -1 };

    find = find.sort(sort);

    let objave = await find.lean();

    // Frontend search
    if (q) {
      const ql = q.trim().toLowerCase();
      objave = objave.filter(
        (o) =>
          o.naslov?.toLowerCase().includes(ql) ||
          o.sadrzaj?.toLowerCase().includes(ql)
      );
    }

    res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju objava.", error: err.message });
  }
};

// Detalj objave po ID-u (auto-increment views)
export const getObjavaById = async (req, res) => {
  try {
    const { id } = req.params;
    await Objava.findByIdAndUpdate(id, { $inc: { views: 1 } });
    const objava = await Objava.findById(id).populate("autor", "ime avatar").populate("odsjek", "naziv");
    if (!objava)
      return res.status(404).json({ message: "Objava nije pronađena." });
    res.status(200).json(ObjavaDTO(objava));
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju objave.", error: err.message });
  }
};

// Kreiraj novu objavu (student → adminu na odobrenje)
export const createObjava = async (req, res) => {
  try {
    const { naslov, sadrzaj, tip, odsjek } = req.body;
    if (!naslov || !sadrzaj || !tip || !odsjek) {
      return res.status(400).json({ message: "Sva polja su obavezna." });
    }

    const novaObjava = new Objava({
      naslov: naslov.trim(),
      sadrzaj: sadrzaj.trim(),
      tip,
      odsjek,
      autor: req.user._id,
      status: "na čekanju",
      datum: new Date(),
    });

    const saved = await novaObjava.save();
    const full = await Objava.findById(saved._id)
      .populate("autor", "ime avatar")
      .populate("odsjek", "naziv");

    res.status(201).json(ObjavaDTO(full));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Greška pri slanju objave.", error: err.message });
  }
};

// Dohvati sve objave za admin panel
export const getAllObjaveAdmin = async (req, res) => {
  try {
    const objave = await Objava.find({})
      .populate("autor", "ime email uloga avatar")
      .populate("odsjek", "naziv")
      .sort({ datum: -1 });

    res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    res.status(500).json({
      message: "Greška pri dohvaćanju admin objava.",
      error: err.message,
    });
  }
};

// Dohvati objave prijavljenog korisnika (Moje objave)
export const getMojeObjave = async (req, res) => {
  try {
    const objave = await Objava.find({ autor: req.user._id })
      .populate("odsjek", "naziv")
      .sort({ datum: -1 });
    res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    res.status(500).json({
      message: "Greška pri dohvaćanju mojih objava.",
      error: err.message,
    });
  }
};

// Admin: promjena statusa objave
export const updateObjavaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) {
      return res
        .status(400)
        .json({ message: "ID i status su obavezni." });
    }

    const updated = await Objava.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("autor", "ime avatar")
      .populate("odsjek", "naziv");

    if (!updated)
      return res.status(404).json({ message: "Objava nije pronađena." });

    res.status(200).json(ObjavaDTO(updated));
  } catch (err) {
    res.status(500).json({
      message: "Greška pri ažuriranju statusa objave.",
      error: err.message,
    });
  }
};

// Admin: brisanje objave
export const deleteObjava = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Objava.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Objava nije pronađena." });
    res.status(200).json({ message: "Objava obrisana." });
  } catch (err) {
    res.status(500).json({
      message: "Greška pri brisanju objave.",
      error: err.message,
    });
  }
};
// GET /api/objave/paginated
export const getPaginatedObjave = async (req, res) => {
  try {
    const { page = 1, limit = 9, tip, odsjek, sortBy = "newest", search } = req.query;

    const query = { status: "odobreno" };

    // Filteri
    if (tip && tip !== "Sve") query.tip = tip;
    if (odsjek) query.odsjek = odsjek;

    // Search (full-text search preko indexa)
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Sortiranje
    let sort = {};
    if (sortBy === "views") {
      sort = { views: -1 };
    } else if (sortBy === "oldest") {
      sort = { datum: 1 };
    } else {
      sort = { datum: -1 }; // newest
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const objave = await Objava.find(query)
      .populate("autor", "ime avatar")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Objava.countDocuments(query);

    res.json({
      objave,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalObjave: total,
      hasMore: skip + objave.length < total,
    });
  } catch (err) {
    console.error("Pagination error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Objave određenog korisnika (javni profil)
export const getObjaveByAutor = async (req, res) => {
  try {
    const { autorId } = req.params;
    if (!autorId) {
      return res.status(400).json({ message: "Nedostaje ID autora." });
    }

    const autorPostoji = await Korisnik.findById(autorId).select("_id");
    if (!autorPostoji) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    const objave = await Objava.find({ autor: autorId, status: "odobreno" })
      .populate("odsjek", "naziv")
      .populate("autor", "ime avatar")
      .sort({ datum: -1 });

    return res.status(200).json(objave.map(ObjavaDTO));
  } catch (err) {
    console.error("getObjaveByAutor error:", err);
    return res.status(500).json({
      message: "Greška pri dohvaćanju objava autora.",
      error: err.message,
    });
  }
};
