import express from "express";
import {
  getObjave,
  getObjavaById,
  createObjava,
  getAllObjaveAdmin,
  getMojeObjave,
  updateObjavaStatus,
  deleteObjava,
  getObjaveByAutor,
  getPaginatedObjave,
  togglePinObjava,
  toggleUrgentnoObjava,
} from "../controllers/objavaController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ JAVNE RUTE - SPECIFIČNE PRVO (bez :id)
router.get("/paginated", getPaginatedObjave);
router.get("/autor/:autorId", getObjaveByAutor);

// ✅ ADMIN RUTE - SPECIFIČNE PRVO
router.get("/admin/sve", protect, protectAdmin, getAllObjaveAdmin);
router.patch("/:id/pin", protect, protectAdmin, togglePinObjava);
router.patch("/:id/urgentno", protect, protectAdmin, toggleUrgentnoObjava);
router.patch("/:id/status", protect, protectAdmin, updateObjavaStatus);

// ✅ ZAŠTIĆENE RUTE ZA STUDENTE
router.post("/", protect, createObjava); // ← VAŽNO:只студенты могут создавать
router.get("/moje", protect, getMojeObjave);

// ✅ JAVNE RUTE - OPĆE (na kraju zbog :id parametra)
router.get("/", getObjave);
router.get("/:id", getObjavaById);

// ✅ SAMO ADMIN MOŽE OBRISATI
router.delete("/:id", protect, protectAdmin, deleteObjava);

export default router;
