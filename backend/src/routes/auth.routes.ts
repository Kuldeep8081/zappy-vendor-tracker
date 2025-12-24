import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

// Register a new vendor
router.post("/register", register);

// Login vendor and return JWT
router.post("/login", login);

export default router;
