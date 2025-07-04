import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import useChat from "../hooks/chatHook";
import { fetchMessages } from "../services/messageService";

const ChatBox = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedChat, getMessagesForChat, setMessagesForChat } = useChat();
  const messages = selectedChat ? getMessagesForChat(selectedChat.id) || [] : [];

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
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold">{selectedChat ?
          selectedChat.isGroup ? selectedChat.name : selectedChat.users[0].id === selectedChat.id ? selectedChat.users[1].name : selectedChat.users[0].name
          : "Selected Chat"}
        </h2>
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