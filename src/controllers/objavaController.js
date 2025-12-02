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


// GET /api/objave/admin/sve - Update za search
export const getAllObjaveAdmin = async (req, res) => {
  try {
    const { search, tip } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { naslov: { $regex: search, $options: "i" } },
        { sadrzaj: { $regex: search, $options: "i" } },
      ];
    }
    if (tip && tip !== "Sve") query.tip = tip;

    const objave = await Objava.find(query)
      .populate("autor", "ime avatar")
      .sort({ datum: -1 });

    // Group by status
    const grouped = {
      "na čekanju": [],
      odobreno: [],
      odbijeno: [],
    };

    objave.forEach((obj) => {
      if (grouped[obj.status]) {
        grouped[obj.status].push(obj);
      }
    });

    res.json(objave); // Šalji sve, grupiranje radi frontend
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ✅ KREIRAJ NOVU OBJAVU - SAMO ZA STUDENTE
export const createObjava = async (req, res) => {
  try {
    // 1. Provjeri je li korisnik prijavljen
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Morate biti prijavljeni." });
    }

    // 2. Provjeri da admin NIJE kreator (admin samo odobrava)
    if (req.user.uloga === "admin") {
      return res.status(403).json({ 
        message: "Administratori ne mogu kreirali objave. Samo študenti." 
      });
    }

    // 3. Validacija podataka
    const { naslov, sadrzaj, tip, odsjek } = req.body;

    if (!naslov || !naslov.trim()) {
      return res.status(400).json({ message: "Naslov je obavezan." });
    }
    if (!sadrzaj || !sadrzaj.trim()) {
      return res.status(400).json({ message: "Sadržaj je obavezan." });
    }
    if (!tip || !tip.trim()) {
      return res.status(400).json({ message: "Vrsta je obavezna." });
    }
    if (!odsjek || !odsjek.trim()) {
      return res.status(400).json({ message: "Odsjek je obavezan." });
    }

    // 4. Provjeri da odsjek postoji
    const odsjekPostoji = await Korisnik.findById(req.user._id).select("odsjek");
    if (!odsjekPostoji) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    // 5. Kreiraj novu objavu
    const novaObjava = new Objava({
      naslov: naslov.trim(),
      sadrzaj: sadrzaj.trim(),
      tip: tip.trim(),
      odsjek: odsjek.trim(),
      autor: req.user._id,
      status: "na čekanju", // Sve objave počinju kao "na čekanju"
      datum: new Date(),
      views: 0,
      saves: 0,
      pinned: false,
      urgentno: false,
    });

    const saved = await novaObjava.save();
    console.log("✅ Objava kreirana:", saved._id);

    // 6. Popuni kompletne podatke
    const full = await Objava.findById(saved._id)
      .populate("autor", "ime avatar")
      .populate("odsjek", "naziv");

    return res.status(201).json({
      message: "Objava poslana na odobrenje!",
      objava: ObjavaDTO(full),
    });
  } catch (err) {
    console.error("❌ createObjava error:", err);
    return res.status(500).json({
      message: "Greška pri slanju objave.",
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
    const { 
      page = 1, 
      limit = 9, 
      tip, 
      odsjek, 
      sortBy = "newest", 
      search,
      periodFilter, // "week", "month", "past"
      mojeSpremljene // "true" ako želi vidjeti samo spremljene
    } = req.query;

    const query = { status: "odobreno" };

    // Filteri
    if (tip && tip !== "Sve") query.tip = tip;
    if (odsjek) query.odsjek = odsjek;

    // Search
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Period filter
    if (periodFilter) {
      const now = new Date();
      if (periodFilter === "week") {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        query.datum = { $gte: weekAgo };
      } else if (periodFilter === "month") {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        query.datum = { $gte: monthAgo };
      } else if (periodFilter === "past") {
        query.datum = { $lt: new Date() };
      }
    }

    // Sortiranje - PINNED PRVO
    let sort = { pinned: -1 }; // Pinned objave uvijek prve
    if (sortBy === "views") {
      sort.views = -1;
    } else if (sortBy === "oldest") {
      sort.datum = 1;
    } else {
      sort.datum = -1; // newest
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const objave = await Objava.find(query)
      .populate("autor", "ime avatar")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Objava.countDocuments(query);

    // Dodaj "isNew" flag za objave mlađe od 3 dana
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const objaveSaFlags = objave.map((obj) => ({
      ...obj.toObject(),
      isNew: new Date(obj.datum) > threeDaysAgo,
    }));

    res.json({
      objave: objaveSaFlags,
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

// PATCH /api/objave/:id/pin
export const togglePinObjava = async (req, res) => {
  try {
    const objava = await Objava.findById(req.params.id);
    if (!objava) return res.status(404).json({ message: "Objava nije pronađena" });

    objava.pinned = !objava.pinned;
    await objava.save();

    res.json({ message: `Objava ${objava.pinned ? "prikvačena" : "otkvačena"}`, objava });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/objave/:id/urgentno
export const toggleUrgentnoObjava = async (req, res) => {
  try {
    const objava = await Objava.findById(req.params.id);
    if (!objava) return res.status(404).json({ message: "Objava nije pronađena" });

    objava.urgentno = !objava.urgentno;
    await objava.save();

    res.json({ message: `Objava ${objava.urgentno ? "označena kao hitna" : "više nije hitna"}`, objava });
  } catch (err) {
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
