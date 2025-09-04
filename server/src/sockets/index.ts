import { Server } from "socket.io"

export const socketHandler = (io: Server) => {
    io.on("connection", (socket) => {
        const user = (socket as any).user;
        console.log(`User connected: ${user.id}`);

        socket.join(user.id);

        socket.on("room:join", (chatIds) => {
            chatIds.forEach((chatId: any) => socket.join(chatId));
        });

        socket.on("message:send", (message) => {
            console.log(message.content);
            socket.to(message.chatId).emit("message:received", message);
        });

        socket.on("chat:create", (chat) => {
            chat.users.forEach((user: any) => {
                socket.to(user.id).emit("chat:created", chat);
            });
        });

        socket.on("group:add", ({ user, chat }) => {
            io.to(user.id).emit("group:added", chat);
        });

        socket.on("group:remove", ({ user, chat }) => {
            io.to(user.id).emit("group:removed", chat);
        });

        socket.on("typing:start", ({ chatId }) => {
            socket.to(chatId).emit("typing:start", { chatId, user });
        });

        socket.on("typing:stop", ({ chatId }) => {
            socket.to(chatId).emit("typing:stop", { chatId, user });
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${user.id}`);
        });
    });
};