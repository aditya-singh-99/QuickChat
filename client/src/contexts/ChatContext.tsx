import { createContext, useEffect, useState } from "react";
import type { User } from "../types/User";
import type { Chat } from "../types/Chat";
import type { Message } from "../types/Message";
import { fetchAllChats } from "../services/chatService";

interface ChatContextType {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addNewChat: (chat: Chat) => void;
  removeChat: (chat: Chat) => void;
  updateRecentMessage: (message: Message) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
  getMessagesForChat: (chatId: string) => Message[] | undefined;
  setMessagesForChat: (chatId: string, messages: Message[]) => void;
  typingUsersMap: Map<string, User[]>;
  addTypingUser: (chatId: string, user: User) => void;
  removeTypingUser: (chatId: string, user: User) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messagesMap, setMessagesMap] = useState<Map<string, Message[]>>(new Map());
  const [typingUsersMap, setTypingUsersMap] = useState<Map<string, User[]>>(new Map());

  const sortChats = (chatList: Chat[]) => {
    return chatList.sort((a, b) => {
      const aTimeStr = a.messages?.[0]?.createdAt || a.updatedAt;
      const bTimeStr = b.messages?.[0]?.createdAt || b.updatedAt;
      const aTime = new Date(aTimeStr);
      const bTime = new Date(bTimeStr);
      return bTime.getTime() - aTime.getTime();
    });
  };

  useEffect(() => {
    const ChatsInit = async () => {
      try {
        const fetchedChats = await fetchAllChats();
        setChats(sortChats(fetchedChats));
      } catch (error: any) {
        alert(error.message);
      }
    }
    ChatsInit();
  }, []);

  const addNewChat = (chat: Chat) => {
    setChats((prev) => [chat, ...prev]);
  };

  const removeChat = (chat: Chat) => {
    if (selectedChat?.id === chat.id) {
      setSelectedChat(null);
    }
    setChats((prev) => prev.filter(c => c.id !== chat.id));
  };

  const updateRecentMessage = (message: Message) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat.id === message.chatId
          ? {
            ...chat,
            messages: [message],
          }
          : chat
      );
      return sortChats(updatedChats);
    });
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

  const addTypingUser = (chatId: string, user: User) => {
    setTypingUsersMap((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(chatId) || [];
      if (!existing.some((u) => u.id === user.id)) {
        newMap.set(chatId, [...existing, user]);
      }
      return newMap;
    });
  };

  const removeTypingUser = (chatId: string, user: User) => {
    setTypingUsersMap((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(chatId) || [];
      newMap.set(chatId, existing.filter((u) => u.id !== user.id));
      return newMap;
    });
  };


  return (
    <ChatContext value={{ chats, setChats, addNewChat, removeChat, updateRecentMessage, selectedChat, setSelectedChat, getMessagesForChat, setMessagesForChat, typingUsersMap, addTypingUser, removeTypingUser }}>
      {children}
    </ChatContext>
  )
}

export default ChatProvider;