import http from "http";
import app from "./app";
import { Server } from "socket.io";
import { socketHandler } from "./sockets";
import jwt, { JwtPayload } from "jsonwebtoken";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));
    try {
        const { user } = jwt.verify(token, String(process.env.JWT_SECRET)) as JwtPayload;
        (socket as any).user = user;
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});
socketHandler(io);

server.listen(5000, () => {
    console.log("Server running on Port: 5000");
});