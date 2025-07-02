import { useEffect, useState } from "react";
import type { Chat } from "../types/Chat";
import { fetchAllChats } from "../services/chatService";
import useAuth from "../hooks/authHook";
import useChat from "../hooks/chatHook";

const Sidebar = () => {
  const { user } = useAuth();
  const { setSelectedChat } = useChat();
  const [chats, setChats] = useState<Chat[]>([]);

  const selectChat = (chat: Chat): void => {
    setSelectedChat(chat);
  }

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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat, i) => (
          <div
            key={i}
            className="p-4 hover:bg-slate-800 border-b border-slate-800 cursor-pointer"
            onClick={_ => selectChat(chat)}
          >
            <h3 className="font-medium">{chat.isGroup ? chat.name : chat.users[0].id === user?.id ? chat.users[1].name : chat.users[0].name}</h3>
            <p className="text-sm text-slate-400">Last message preview...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;