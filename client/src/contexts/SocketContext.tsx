import { createContext, useEffect } from "react";
import { io } from "socket.io-client";
import type { Message } from "../types/Message";
import type { Chat } from "../types/Chat";
import useChat from "../hooks/chatHook";

const socket = io(import.meta.env.VITE_BASE_URL, {
  auth: {
    token: localStorage.getItem("JWTtoken"),
  },
  withCredentials: true,
  autoConnect: false
});

interface SocketContextType {
  emitMessage: (message: Message) => void;
  emitChatCreation: (chat: Chat) => void;
}

export const SocketContext = createContext<SocketContextType | null>(null);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { chats, addNewChat, updateRecentMessage, getMessagesForChat, setMessagesForChat } = useChat();

  useEffect(() => {
    socket.connect();
    socket.emit("room:join", chats.map(chat => chat.id));

    socket.on("message:received", (message: Message) => {
      updateRecentMessage(message);
      const messages = getMessagesForChat(message.chatId);
      if (messages) {
        setMessagesForChat(message.chatId, [...messages, message]);
      }
    });

    socket.on("chat:created", (chat: Chat) => {
      addNewChat(chat);
    });

    return () => {
      socket.disconnect();
    };
  }, [chats, getMessagesForChat, setMessagesForChat]);

  const emitMessage = (message: Message) => {
    socket.emit("message:send", message);
  };

  const emitChatCreation = (chat: Chat) => {
    socket.emit("chat:create", chat);
  };

  return (
    <SocketContext value={{ emitMessage, emitChatCreation }}>
      {children}
    </SocketContext>
  )
}

export default SocketProvider;