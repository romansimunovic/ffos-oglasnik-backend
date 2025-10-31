import express from "express";
import {
  getObjave, createObjava, deleteObjava, getSveObjave, updateObjavaStatus,
} from "../controllers/objavaController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getObjave);
router.get("/admin", protect, protectAdmin, getSveObjave);
router.post("/", protect, createObjava);
router.put("/:id/status", protect, protectAdmin, updateObjavaStatus);
router.delete("/:id", protect, protectAdmin, deleteObjava);

export default router;
