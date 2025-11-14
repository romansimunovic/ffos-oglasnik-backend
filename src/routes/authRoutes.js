import express from "express";
import { login, register, adminLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login); // za obične korisnike
router.post("/admin/login", adminLogin); // za admina
router.post("/register", register);

export default router;
