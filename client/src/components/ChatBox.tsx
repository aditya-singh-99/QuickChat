import { useEffect, useRef, useState } from "react";
import type { Message } from "../types/Message";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import useChat from "../hooks/chatHook";
import { fetchMessages } from "../services/messageService";

const ChatBox = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedChat, getMessagesForChat, setMessagesForChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "instant" });
  }, [selectedChat]);

  useEffect(() => {
    const loadChat = async () => {
      if (!selectedChat) {
        return;
      }
      const cacheMessages = getMessagesForChat(selectedChat.id);
      if (!cacheMessages) {
        console.log("Fetching messages...");
        try {
          const fetchedMessages = await fetchMessages(selectedChat.id);
          setMessagesForChat(selectedChat.id, fetchedMessages);
          setMessages(fetchedMessages);
        } catch (error: any) {
          setMessages([]);
          alert(error.message);
        }
      }
    };
    loadChat();
  }, [selectedChat]);

  return (
    selectedChat ? (
      <div className="h-full flex flex-col">

        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold">Selected Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {messages.map((message, i) => (
            <MessageBubble message={message} key={i} />
          ))}
          <div ref={scrollRef}></div>
        </div>

        <MessageInput />
      </div>
    ) : (<h1>Nothing to show</h1>)
  );
};

export default ChatBox;
