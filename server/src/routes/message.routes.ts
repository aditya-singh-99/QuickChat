import express from "express";
import { verifyToken } from "../middlewares/authentication.middleware";
import { getMessages, sendMessage } from "../controllers/message.controller";

const router = express.Router();

router.use(verifyToken);

router.post("/", sendMessage);
router.get("/:chatId", getMessages);

export default router;