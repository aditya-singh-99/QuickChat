import { useState } from "react";
import type { Chat } from "../types/Chat";
import useAuth from "../hooks/authHook";
import useChat from "../hooks/chatHook";
import NewChatModal from "./NewChatModal";
import { PlusIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/solid";

const Sidebar = () => {
  const { user } = useAuth();
  const { chats, setSelectedChat } = useChat();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const selectChat = (chat: Chat): void => {
    setSelectedChat(chat);
  };

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
            <div className="flex items-center gap-3">
              {chat.isGroup
                ? <UserGroupIcon className="w-10 h-10 text-slate-500 bg-slate-700 p-2 rounded-full flex-shrink-0" />
                : <UserIcon className="w-10 h-10 text-slate-500 bg-slate-700 p-2 rounded-full flex-shrink-0" />
              }
              <div className="flex flex-col overflow-hidden">
                <h3 className="font-medium text-white truncate">
                  {chat.isGroup ? chat.name : chat.users[0].id === user?.id ? chat.users[1].name : chat.users[0].name}
                </h3>
                {chat.messages?.[0] && (
                  <p className="text-sm text-slate-400 truncate">
                    {chat.messages[0].content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen ?
        <NewChatModal onClose={() => setIsModalOpen(false)} />
        :
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-green-500 hover:bg-green-600 text-white mx-auto mb-4 px-4 py-2 rounded-full shadow-md cursor-pointer"
        >
          <PlusIcon className="size-5" />
          New Chat
        </button>
      }
    </div>
  );
};

export default Sidebar;