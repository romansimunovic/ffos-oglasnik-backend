import express from "express";
import {
  getObjave,
  createObjava,
  deleteObjava,
  getSveObjave,
  updateObjavaStatus,
} from "../controllers/objavaController.js";

const router = express.Router();

router.get("/", getObjave);
router.get("/admin", getSveObjave);
router.post("/", createObjava);
router.put("/:id", updateObjavaStatus);
router.delete("/:id", deleteObjava);

export default router;
