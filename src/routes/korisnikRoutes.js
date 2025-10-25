import express from "express";
import * as korisnikController from "../controllers/korisnikController.js";

const router = express.Router();

router.get("/", korisnikController.getAllKorisnici);
router.post("/", korisnikController.createKorisnik);
router.delete("/:id", korisnikController.deleteKorisnik);

export default router;
