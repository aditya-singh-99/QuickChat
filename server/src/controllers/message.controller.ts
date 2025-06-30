import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const content = req.body;
        const chatId = req.body;
        await prisma.message.create({
            data: {
                content: content,
                senderId: user.id,
                chatId: chatId
            }
        })
        res.status(200).json({ message: "Message sent successfully." });
    } catch (error: any) {
        console.error("Error in message controller:", error.message);
        res.status(400).json({ error: "Error occurred during sending message." });
    }
}

export const getMessages = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { chatId } = req.params;
        const messages = await prisma.message.findMany({
            where: {
                chatId: chatId
            }
        })
        res.status(200).json({ messages, message: "Message sent successfully." });
    } catch (error: any) {
        console.error("Error in message controller:", error.message);
        res.status(400).json({ error: "Error occurred during sending message." });
    }
}