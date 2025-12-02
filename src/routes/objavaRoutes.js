// src/routes/objavaRoutes.js
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
  getPaginatedObjave, // ✅ Dodaj import
} from "../controllers/objavaController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ BITNO: Specifične rute MORAJU biti PRIJE dinamičkih /:id ruta

// Javne rute - SPECIFIČNE PRVO
router.get("/paginated", getPaginatedObjave); // ✅ OVO MORA BITI PRIJE /:id
router.get("/autor/:autorId", getObjaveByAutor);

// Admin rute - SPECIFIČNE PRVO
router.get("/admin/sve", protect, protectAdmin, getAllObjaveAdmin);

// Za prijavljenog korisnika
router.get("/moje", protect, getMojeObjave); // ✅ PRIJE /:id

// Javne rute - OPĆE
router.get("/", getObjave);
router.get("/:id", getObjavaById); // ✅ OVO MORA BITI NA KRAJU

// Create/Update/Delete
router.post("/", protect, createObjava);
router.patch("/:id/status", protect, protectAdmin, updateObjavaStatus);
router.delete("/:id", protect, protectAdmin, deleteObjava);

export default router;
