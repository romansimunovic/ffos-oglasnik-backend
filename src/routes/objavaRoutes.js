import express from "express";
import {
  getObjave,
  getObjavaById,
  createObjava,
  deleteObjava,
  updateObjavaStatus,
  getPendingObjave
} from "../controllers/objavaController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin", protect, protectAdmin, getPendingObjave); // MORA biti na vrhu!
router.get("/", getObjave);
router.get("/:id", getObjavaById);

router.post("/", protect, createObjava);
router.put("/:id/status", protect, protectAdmin, updateObjavaStatus);
router.delete("/:id", protect, protectAdmin, deleteObjava);

export default router;
