import express from "express";
import { verifyToken } from "../middlewares/authentication.middleware";
import { getUser, getUsers } from "../controllers/user.controller";

const router = express.Router();

router.use(verifyToken);

router.get("/", getUsers);
router.get("/:id",getUser);

export default router;