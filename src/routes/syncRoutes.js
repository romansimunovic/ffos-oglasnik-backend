import express from "express";
import { syncFFOSVijesti } from "../controllers/syncController.js";

const router = express.Router();
router.post("/ffos", syncFFOSVijesti);
export default router;
