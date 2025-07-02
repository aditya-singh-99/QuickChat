import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {
        const { name = null, email, password } = req.body;
        const userExist = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (userExist) {
            res.status(409).json({ error: "Email already registered." });
            return;
        }
        await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password
            }
        });
        res.status(201).json({ message: "User registration successful." });
    } catch (error: any) {
        console.error("Error in register controller:", error.message);
        res.status(400).json({ error: "Error occured during user registration." });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
                password: password
            },
            omit: {
                password: true
            }
        });
        if (!user) {
            res.status(401).json({ error: "Invalid login email and password." });
            return;
        }
        const token = jwt.sign({ user }, String(process.env.JWT_SECRET), { expiresIn: "15d" });
        res.status(200).json({ user, token, message: "Login successful." });
    } catch (error: any) {
        console.error("Error in login controller:", error.message);
        res.status(400).json({ error: "Error occured during user login." });
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        res.status(200).json({ user, message: "User profile fetched successfully." });
    } catch (error: any) {
        console.error("Error in getMe controller:", error.message);
        res.status(400).json({ error: "Error occured during fetchMe." });
    }
}