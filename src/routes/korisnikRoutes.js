// src/routes/korisnikRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { protect } from "../middleware/authMiddleware.js";
import {
  spremiObjavu,
  getSpremljeneObjave,
  uploadAvatar,
  getKorisnikById,
  ukloniSpremljenuObjavu,
} from "../controllers/korisnikController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure uploads dir exists
const avatarsDir = path.join(__dirname, "../../uploads/avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    // ako protect nije prošao, fallback na "anon"
    const base = req.user?._id?.toString() || `anon-${Date.now()}`;
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

// only images, size limit
function fileFilter(req, file, cb) {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Samo PNG / JPEG / WEBP su dozvoljeni."), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter,
});

// ---- STATIC / NON-PARAM rute (moraju ići prije param route) ----
// SPREMANJE objave u user's favourites (protected)
// NOTE: frontend treba POST /korisnik/spremiObjavu/:objavaId
router.post("/spremiObjavu/:objavaId", protect, spremiObjavu);

// DOHVAT spremljenih za trenutnog usera (protected)
// frontend GET /korisnik/spremljene
router.get("/spremljene", protect, getSpremljeneObjave);

// Ukloni spremljenu objavu (protected)
// frontend DELETE /korisnik/spremljene/:objavaId
router.delete("/spremljene/:objavaId", protect, ukloniSpremljenuObjavu);

// Upload avatar (protected + multer)
// multipart/form-data field name: "avatar"
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

// ---- PARAM rute (public profile by id) ----
// GET /korisnik/:id  (public)
router.get("/:id", getKorisnikById);

export default router;
