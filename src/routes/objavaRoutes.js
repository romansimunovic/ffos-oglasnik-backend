import express from "express";
import { getObjave, createObjava, deleteObjava } from "../controllers/objavaController.js";

const router = express.Router();

router.get("/", getObjave);
router.post("/", createObjava);
router.delete("/:id", deleteObjava);

export default router;
