import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ error: "JWT token required for this route." });
            return;
        }
        const { user } = jwt.verify(token, String(process.env.JWT_SECRET)) as JwtPayload;
        (req as any).user = user;
        next();
    } catch (error: any) {
        console.error("Error in verifyToken middleware:", error.message);
        res.status(401).json({ error: "JWT token is invalid." });
    }
}