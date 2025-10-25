import express from "express";
import { getVijesti } from "../controllers/vijestController.js";
const router = express.Router();

router.get("/", getVijesti);

export default router;
