import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import useChat from "../hooks/chatHook";
import { fetchMessages } from "../services/messageService";
import ManageGroupModal from "./ManageGroupModal";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/solid";

const ChatBox = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedChat, getMessagesForChat, setMessagesForChat } = useChat();
  const messages = selectedChat ? getMessagesForChat(selectedChat.id) || [] : [];
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  useEffect(() => {
    const loadChat = async () => {
      if (!selectedChat) {
        return;
      }
      let cacheMessages = getMessagesForChat(selectedChat.id);
      if (!cacheMessages) {
        console.log("Fetching messages...");
        try {
          cacheMessages = await fetchMessages(selectedChat.id);
        } catch (error: any) {
          cacheMessages = [];
          alert(error.message);
        }
      }
      setMessagesForChat(selectedChat.id, cacheMessages);
    };
    loadChat();
  }, [selectedChat]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedChat && (
            <div className="flex-shrink-0">
              {selectedChat.isGroup ? (
                <UserGroupIcon className="size-8 text-slate-500 bg-slate-700 p-1.5 rounded-full" />
              ) : (
                <UserIcon className="size-8 text-slate-500 bg-slate-700 p-1.5 rounded-full" />
              )}
            </div>
          )}
          <h2 className="text-xl font-semibold text-white truncate">
            {selectedChat
              ? selectedChat.isGroup
                ? selectedChat.name
                : selectedChat.users[0].id === selectedChat.id
                  ? selectedChat.users[1].name
                  : selectedChat.users[0].name
              : "Selected Chat"}
          </h2>
        </div>

        {selectedChat?.isGroup && (
          <button onClick={() => setIsModalOpen(true)} className="text-sm text-green-400 hover:text-green-500 font-medium">
            Manage Group
          </button>
        )}
        {isModalOpen && <ManageGroupModal onClose={() => setIsModalOpen(false)} />}
      </div>


      {selectedChat ?
        <>
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {messages.map((message, i) => (
              <MessageBubble message={message} key={i} />
            ))}
            <div ref={scrollRef}></div>
          </div>

          <MessageInput />
        </> :
        <></>
      }
    </div>
  );
};

export default ChatBox;