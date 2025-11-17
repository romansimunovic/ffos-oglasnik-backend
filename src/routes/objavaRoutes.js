import express from "express";
import {
  getObjave,
  getObjavaById,
  createObjava,
  deleteObjava,
  updateObjavaStatus,
  getSpremljeneObjave,
  getAllObjaveAdmin
} from "../controllers/objavaController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin", protect, protectAdmin, getAllObjaveAdmin);
router.get("/", getObjave);
router.get("/:id", getObjavaById);
router.get('/spremljene', protect, getSpremljeneObjave);
router.post("/", protect, createObjava);
router.put("/:id/status", protect, protectAdmin, updateObjavaStatus);
router.delete("/:id", protect, protectAdmin, deleteObjava);

export default router;
