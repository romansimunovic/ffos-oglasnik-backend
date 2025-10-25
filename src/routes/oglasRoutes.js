import express from "express";
import * as oglasController from "../controllers/oglasController.js";

const router = express.Router();

router.get("/", oglasController.getAllOglasi);
router.post("/", oglasController.createOglas);
router.put("/:id", oglasController.updateOglas);
router.delete("/:id", oglasController.deleteOglas);

export default router;
