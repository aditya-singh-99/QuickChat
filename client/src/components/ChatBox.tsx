import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import useChat from "../hooks/chatHook";
import { fetchMessages } from "../services/messageService";
import ManageGroupModal from "./ManageGroupModal";
import { Link } from "react-router";
import useAuth from "../hooks/authHook";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/solid";

const ChatBox = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuth();
  const { selectedChat, getMessagesForChat, setMessagesForChat, typingUsersMap } = useChat();
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

  const typingUsers = selectedChat
    ? (typingUsersMap.get(selectedChat.id) || []).filter(
      (u) => u.id !== currentUser?.id
    )
    : [];

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
                : selectedChat.users[0].id === currentUser?.id
                  ? selectedChat.users[1].name
                  : selectedChat.users[0].name
              : "Select a Chat to view Messages"}
          </h2>
        </div>

        {selectedChat && (selectedChat.isGroup ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-green-400 hover:text-green-500 font-medium cursor-pointer"
          >
            View Group
          </button>
        ) : (
          <Link
            to={`/profile/${selectedChat.users[0].id === currentUser?.id ? selectedChat.users[1].id : selectedChat.users[0].id}`}
            className="text-sm text-green-400 hover:text-green-500 font-medium"
          >
            View Profile
          </Link>
        ))}
        {isModalOpen && <ManageGroupModal onClose={() => setIsModalOpen(false)} />}
      </div>


      {selectedChat ?
        <>
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {messages.map((message, i) => (
              <MessageBubble message={message} users={selectedChat.users} key={i} />
            ))}
            {typingUsers.length > 0 && (
              <div className="text-xs text-gray-400 italic ml-2">
                {typingUsers.map((u) => u.name).join(", ")}{" "}
                {typingUsers.length === 1 ? "is typing..." : "are typing..."}
              </div>
            )}
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