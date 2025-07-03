import { createContext, useEffect, useState } from "react";
import type { Chat } from "../types/Chat";
import type { Message } from "../types/Message";
import { fetchAllChats } from "../services/chatService";

interface ChatContextType {
  chats: Chat[];
  addNewChat: (chat: Chat) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
  getMessagesForChat: (chatId: string) => Message[] | undefined;
  setMessagesForChat: (chatId: string, messages: Message[]) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messagesMap, setMessagesMap] = useState<Map<string, Message[]>>(new Map());

  useEffect(() => {
    const ChatsInit = async () => {
      try {
        const fetchedChats = await fetchAllChats();
        setChats(fetchedChats);
      } catch (error: any) {
        alert(error.message);
      }
    }
    ChatsInit();
  }, []);

  const addNewChat = (chat: Chat) => {
    setChats((prev) => [chat, ...prev]);
  };

  const getMessagesForChat = (chatId: string): Message[] | undefined => {
    return messagesMap.get(chatId);
  };

  const setMessagesForChat = (chatId: string, messages: Message[]) => {
    setMessagesMap(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(chatId, messages);
      return newMap;
    });
  };

  return (
    <ChatContext value={{ chats, addNewChat, selectedChat, setSelectedChat, getMessagesForChat, setMessagesForChat }}>
      {children}
    </ChatContext>
  )
}

export default ChatProvider;