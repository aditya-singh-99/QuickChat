import type { Message } from "../types/Message";
import type { User } from "../types/User";
import useAuth from "../hooks/authHook";

const MessageBubble = ({ message, users }: { message: Message, users: User[] }) => {
  const { user } = useAuth();
  const sender = users.find((u) => u.id === message.senderId);
  const isGroupChat = users.length >= 3;

  return (
    <div
      className={`max-w-xs p-3 rounded-xl ${message.senderId === user?.id ? "bg-green-500 ml-auto" : "bg-slate-700 mr-auto"
        }`}
    >
      {isGroupChat && message.senderId !== user?.id && sender && (
        <div className="text-xs text-gray-300 mb-1">{sender.name}</div>
      )}
      {message.content}
    </div>
  );
};

export default MessageBubble;