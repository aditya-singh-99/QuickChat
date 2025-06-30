import express from "express";
import { addParticipant, createChat, getChat, getChats, removeParticipant, updateGroup } from "../controllers/chat.contoller";
import { verifyToken } from "../middlewares/authentication.middleware";

const router = express.Router();

router.use(verifyToken);

router.get("/", getChats);
router.post("/", createChat);
router.get("/:id", getChat);
router.put("/group", updateGroup);
router.put("/group/add", addParticipant);
router.put("/group/remove", removeParticipant);

export default router;