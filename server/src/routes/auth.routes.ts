import express from "express";
import { getMe, login, register } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/authentication.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);

export default router;