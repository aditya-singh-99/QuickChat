import express from "express";
import { verifyToken } from "../middlewares/authentication.middleware";
import { getUser, searchUsers } from "../controllers/user.controller";

const router = express.Router();

router.use(verifyToken);

router.get("/", searchUsers);
router.get("/:id",getUser);

export default router;