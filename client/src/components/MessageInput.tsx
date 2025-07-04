import { useState } from "react";
import { sendMessage } from "../services/messageService";
import useChat from "../hooks/chatHook";
import useSocket from "../hooks/socketHook";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const MessageInput = () => {
  const { updateRecentMessage, selectedChat, getMessagesForChat, setMessagesForChat } = useChat();
  const { emitMessage } = useSocket();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !selectedChat) {
      return;
    }
    console.log("Sending message...");
    try {
      const sentMessage = await sendMessage(message, selectedChat.id);
      emitMessage(sentMessage);
      const messages = getMessagesForChat(selectedChat.id) || [];
      setMessagesForChat(selectedChat.id, [...messages, sentMessage]);
      updateRecentMessage(sentMessage);
      setMessage("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="p-4 border-t border-slate-700">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer"
        >
          <PaperAirplaneIcon className="size-6" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;