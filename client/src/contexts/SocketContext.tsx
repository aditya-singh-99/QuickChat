import { createContext, useEffect } from "react";
import { io } from "socket.io-client";
import type { User } from "../types/User";
import type { Chat } from "../types/Chat";
import type { Message } from "../types/Message";
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
  emitAddMember: (user: User, chat: Chat) => void;
  emitRemoveMember: (user: User, chat: Chat) => void;
}

export const SocketContext = createContext<SocketContextType | null>(null);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { chats, addNewChat, removeChat, updateRecentMessage, getMessagesForChat, setMessagesForChat } = useChat();

  useEffect(() => {
    socket.connect();
    socket.emit("room:join", chats.map(chat => chat.id));

    const handleMessageReceived = (message: Message) => {
      updateRecentMessage(message);
      const messages = getMessagesForChat(message.chatId);
      if (messages) {
        setMessagesForChat(message.chatId, [...messages, message]);
      }
    };

    const handleChatCreated = (chat: Chat) => {
      addNewChat(chat);
    };

    const handleGroupAdded = (chat: Chat) => {
      addNewChat(chat);
    };

    const handleGroupRemoved = (chat: Chat) => {
      removeChat(chat);
    };

    socket.on("message:received", handleMessageReceived);
    socket.on("chat:created", handleChatCreated);
    socket.on("group:added", handleGroupAdded);
    socket.on("group:removed", handleGroupRemoved);

    return () => {
      socket.off("message:received", handleMessageReceived);
      socket.off("chat:created", handleChatCreated);
      socket.off("group:added", handleGroupAdded);
      socket.off("group:removed", handleGroupRemoved);
      socket.disconnect();
    };
  }, [chats, getMessagesForChat]);


  const emitMessage = (message: Message) => {
    socket.emit("message:send", message);
  };

  const emitChatCreation = (chat: Chat) => {
    socket.emit("chat:create", chat);
  };

  const emitAddMember = (user: User, chat: Chat) => {
    socket.emit("group:add", { user, chat });
  };

  const emitRemoveMember = (user: User, chat: Chat) => {
    socket.emit("group:remove", { user, chat });
  };

  return (
    <SocketContext value={{ emitMessage, emitChatCreation, emitAddMember, emitRemoveMember }}>
      {children}
    </SocketContext>
  )
}

export default SocketProvider;