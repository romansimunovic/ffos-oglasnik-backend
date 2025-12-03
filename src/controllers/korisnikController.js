// src/controllers/korisnikController.js
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Korisnik from "../models/Korisnik.js";
import Objava from "../models/Objava.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "../../uploads/avatars");

const buildFullAvatarUrl = (avatarPath, req) => {
  if (!avatarPath) return null;
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://"))
    return avatarPath;
  // ako imamo req, iz njega izvuci host, inače fallback na BACKEND_URL
  if (req) {
    return `${req.protocol}://${req.get("host")}${avatarPath}`;
  }
  const backendBase = process.env.BACKEND_URL || "";
  return backendBase ? `${backendBase}${avatarPath}` : avatarPath;
};

// Dodaj $inc: { saves: 1 }
export const spremiObjavu = async (req, res) => {
  try {
    const objavaId = req.params.objavaId || req.params.id;
    if (!objavaId)
      return res.status(400).json({ message: "ID objave nije proslijeđen." });
    if (!req.user || !req.user._id)
      return res.status(401).json({ message: "Niste autorizirani." });

    const objava = await Objava.findById(objavaId).select("_id");
    if (!objava) return res.status(404).json({ message: "Objava ne postoji." });

    await Objava.findByIdAndUpdate(objava._id, { $inc: { saves: 1 } }); // inkrement saves
    const updated = await Korisnik.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { spremljeneObjave: objava._id } },
      { new: true }
    ).select("spremljeneObjave");
    return res.status(200).json({
      message: "Objava spremljena.",
      count: updated?.spremljeneObjave?.length ?? 0,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Greška pri spremanju objave.", error: err.message });
  }
};

export const getSpremljeneObjave = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Niste autorizirani." });
    }

    const korisnik = await Korisnik.findById(req.user._id).populate({
      path: "spremljeneObjave",
      populate: [{ path: "autor", select: "ime avatar" }],
    });

    if (!korisnik) {
      return res.status(404).json({ message: "Korisnik ne postoji." });
    }

    const result = (korisnik.spremljeneObjave || []).map((o) => ({
      _id: o._id,
      naslov: o.naslov,
      sadrzaj: o.sadrzaj,
      tip: o.tip,
      autor: o.autor?.ime || "Nepoznato",
      autorAvatar: o.autor?.avatar || null,
      autorId: o.autor?._id || null,
      odsjek: o.odsjek,
      datum: o.datum,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("getSpremljeneObjave error:", err);
    return res.status(500).json({
      message: "Greška dohvaćanja spremljenih objava.",
      error: err.message,
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Niste autorizirani." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Nema datoteke." });
    }

    const avatarRelative = `/uploads/avatars/${req.file.filename}`;
    const avatarFull = buildFullAvatarUrl(avatarRelative, req);

    // pokušaj obrisati stari avatar ako je lokalni
    try {
      const prev = await Korisnik.findById(req.user._id).select("avatar");
      if (prev?.avatar && prev.avatar.includes("/uploads/avatars/")) {
        const prevFilename = path.basename(prev.avatar);
        const prevFilePath = path.join(UPLOADS_DIR, prevFilename);
        if (fs.existsSync(prevFilePath)) {
          fs.unlink(prevFilePath, (err) => {
            if (err)
              console.warn("Ne mogu obrisati prethodni avatar:", err.message);
          });
        }
      }
    } catch (e) {
      console.warn("Problem pri pokušaju brisanja starog avatara:", e.message);
    }

    const updated = await Korisnik.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarFull },
      { new: true }
    ).select("avatar ime email uloga");

    return res.status(200).json({
      message: "Avatar ažuriran.",
      avatar: updated.avatar,
      user: updated,
    });
  } catch (err) {
    console.error("uploadAvatar error:", err);
    return res.status(500).json({
      message: "Greška pri spremanju avatar slike.",
      error: err.message,
    });
  }
};

// NEW: publicni endpoint za dohvat korisnika po id (bez lozinke)
export const getKorisnikById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "ID nije proslijeđen." });

    const korisnik = await Korisnik.findById(id).select(
      "ime uloga avatar createdAt"
    );
    if (!korisnik)
      return res.status(404).json({ message: "Korisnik nije pronađen." });

    // ako avatar je relativan, vratimo pun URL koristeći req
    const avatarFull = korisnik.avatar
      ? buildFullAvatarUrl(korisnik.avatar, req)
      : null;

    return res.status(200).json({
      _id: korisnik._id,
      ime: korisnik.ime,
      uloga: korisnik.uloga,
      avatar: avatarFull,
      createdAt: korisnik.createdAt,
    });
  } catch (err) {
    console.error("getKorisnikById error:", err);
    return res.status(500).json({
      message: "Greška pri dohvaćanju korisnika.",
      error: err.message,
    });
  }
};

export const ukloniSpremljenuObjavu = async (req, res) => {
  try {
    const objavaId = req.params.objavaId || req.params.id;
    if (!objavaId) {
      return res.status(400).json({ message: "ID objave nije proslijeđen." });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Niste autorizirani." });
    }

    const objava = await Objava.findById(objavaId).select("_id saves");
    if (!objava) {
      return res.status(404).json({ message: "Objava ne postoji." });
    }

    // 1) makni objavu iz spremljenih kod korisnika
    const korisnik = await Korisnik.findByIdAndUpdate(
      req.user._id,
      { $pull: { spremljeneObjave: objava._id } },
      { new: true }
    ).select("spremljeneObjave");

    if (!korisnik) {
      return res.status(404).json({ message: "Korisnik ne postoji." });
    }

    // 2) smanji saves counter na objavi (ne idemo ispod 0)
    if (typeof objava.saves === "number" && objava.saves > 0) {
      await Objava.findByIdAndUpdate(objava._id, { $inc: { saves: -1 } });
    }

    return res.status(200).json({
      message: "Objava uklonjena iz spremljenih.",
      count: korisnik.spremljeneObjave.length,
    });
  } catch (err) {
    console.error("ukloniSpremljenuObjavu error:", err);
    return res.status(500).json({
      message: "Greška pri uklanjanju spremljene objave.",
      error: err.message,
    });
  }
};
