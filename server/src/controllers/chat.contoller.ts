import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getChats = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const chats = await prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: user.id
                    }
                }
            }
        });
        res.status(200).json({ chats, message: "All chats retrieved successfully." });
    } catch (error: any) {
        console.error("Error in chat controller:", error.message);
        res.status(400).json({ error: "Error occurred during retrieving chats." });
    }
}

export const createChat = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        let participant = req.body;
        const isGroup = Array.isArray(participant);
        if (!isGroup)
            participant = [participant]
        const chat = await prisma.chat.create({
            data: {
                name: isGroup ? req.body.name : null,
                isGroup: isGroup,
                adminId: isGroup ? user.id : null,
                users: {
                    connect: [{ id: user.id }, ...participant.map((p: any) => ({ id: p }))]
                }
            }
        });
        res.status(200).json({ chat, message: "Chat created successfully." });
    } catch (error: any) {
        console.error("Error in chat controller:", error.message);
        res.status(400).json({ error: "Error occurred during chat creation." });
    }
}

export const getChat = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const id = req.body;
        const chat = await prisma.chat.findUnique({
            where: {
                id: id,
                users: {
                    some: {
                        id: user.id
                    }
                }
            },
        });
        if (!chat) {
            res.status(404).json({ error: "Chat not found." });
            return;
        }
        res.status(200).json({ chat, message: "Chat retrieval successful." });
    } catch (error: any) {
        console.error("Error in chat controller:", error.message);
        res.status(400).json({ error: "Error occurred during chat retrieval." });
    }
}

export const updateGroup = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        await prisma.chat.update({
            data: {
                name: req.body.name
            },
            where: {
                id: req.body.id,
                isGroup: true,
                adminId: user.id
            }
        });
        res.status(200).json({ message: "Group updates successfully." });
    } catch (error: any) {
        console.error("Error in chat controller:", error.message);
        res.status(400).json({ error: "Error occurred during updating group." });
    }
}

export const addParticipant = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        await prisma.chat.update({
            where: {
                id: req.body.id,
                isGroup: true,
                adminId: user.id
            },
            data: {
                users: {
                    connect: {
                        id: req.body.participant
                    }
                }
            }
        });
        res.status(200).json({ message: "Participant added to the group successfully." });
    } catch (error: any) {
        console.error("Error in chat controller:", error.message);
        res.status(400).json({ error: "Error occurred during adding participant." });
    }
}

export const removeParticipant = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        await prisma.chat.update({
            where: {
                id: req.body.id,
                isGroup: true,
                adminId: user.id
            },
            data: {
                users: {
                    disconnect: {
                        id: req.body.participant
                    }
                }
            }
        });
        res.status(200).json({ message: "Participant removed from the group successfully." });
    } catch (error: any) {
        console.error("Error in chat controller:", error.message);
        res.status(400).json({ error: "Error occurred during removing participant." });
    }
}