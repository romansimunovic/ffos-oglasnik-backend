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
  getKorisnikById, // <-- import add
} from "../controllers/korisnikController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure avatars upload directory exists (relative to project root/uploads/avatars)
const avatarsDir = path.join(__dirname, "../../uploads/avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const base = req.user?._id?.toString() || "anon";
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

// only allow images and limit size
function fileFilter(req, file, cb) {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Samo PNG/JPEG/WebP su dozvoljeni."), false);
    return;
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter,
});

// specific routes (non-param) — keep these before the generic "/:id"
router.post("/spremiObjavu/:objavaId", protect, spremiObjavu);
router.get("/spremljene", protect, getSpremljeneObjave);
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

// PUBLIC user profile by id (param route) — put after other static routes
router.get("/:id", getKorisnikById);

export default router;
