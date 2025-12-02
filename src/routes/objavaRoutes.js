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
} from "../controllers/objavaController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// javne rute
router.get("/", getObjave);
router.get("/autor/:autorId", getObjaveByAutor);
router.get("/:id", getObjavaById);

// za prijavljenog korisnika
router.get("/moje", protect, getMojeObjave);
router.post("/", protect, createObjava);

// admin rute
router.get("/admin/sve", protect, protectAdmin, getAllObjaveAdmin);
router.patch("/:id/status", protect, protectAdmin, updateObjavaStatus);
router.delete("/:id", protect, protectAdmin, deleteObjava);

export default router;
