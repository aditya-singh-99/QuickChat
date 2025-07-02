import { createContext, useState } from "react";
import type { Chat } from "../types/Chat";
import type { Message } from "../types/Message";

interface ChatContextType {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
  getMessagesForChat: (chatId: string) => Message[] | undefined;
  setMessagesForChat: (chatId: string, messages: Message[]) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messagesMap, setMessagesMap] = useState<Map<string, Message[]>>(new Map());

  const getMessagesForChat = (chatId: string): Message[] | undefined => {
    return messagesMap.get(chatId);
  }

  const setMessagesForChat = (chatId: string, messages: Message[]) => {
    setMessagesMap(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(chatId, messages);
      return newMap;
    });
  }

  return (
    <ChatContext value={{ selectedChat, setSelectedChat, getMessagesForChat, setMessagesForChat }}>
      {children}
    </ChatContext>
  )
}

export default ChatProvider;