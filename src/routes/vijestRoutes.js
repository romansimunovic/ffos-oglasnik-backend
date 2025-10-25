import express from "express";
import * as vijestController from "../controllers/vijestController.js";

const router = express.Router();

router.get("/", vijestController.getAllVijesti);
router.post("/", vijestController.createVijest);
router.delete("/:id", vijestController.deleteVijest);

export default router;
