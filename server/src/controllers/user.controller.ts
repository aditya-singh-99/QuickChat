import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        if (typeof query !== "string" || query.trim() === "") {
            res.status(400).json({ error: "Search query is required" });
            return;
        }
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            },
            where: {
                email: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            take: 10
        });
        res.status(200).json({ users, message: "Users search successful." });
    } catch (error: any) {
        console.error("Error in user controller:", error.message);
        res.status(400).json({ error: "Error occurred during searching users." });
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const users = await prisma.user.findUnique({
            where: {
                id: id
            },
            omit: {
                password: true
            }
        });
        res.status(200).json({ users, message: "User retrieval successful." });
    } catch (error: any) {
        console.error("Error in user controller:", error.message);
        res.status(400).json({ error: "Error occurred during user retrieval." });
    }
}
