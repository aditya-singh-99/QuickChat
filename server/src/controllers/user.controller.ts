import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        res.status(200).json({ users, message: "Users retrieval successful." });
    } catch (error: any) {
        console.error("Error in user controller:", error.message);
        res.status(400).json({ error: "Error occurred during users retrieval." });
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
