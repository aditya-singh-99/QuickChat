import type { Message } from "../types/Message";
import useAuth from "../hooks/authHook";

const MessageBubble = ({ message }: { message: Message }) => {
  const { user } = useAuth();
  console.log(message)
  return (
    <div
      className={`max-w-xs p-3 rounded-xl ${message.senderId === user?.id ? "bg-green-500 ml-auto" : "bg-slate-700 mr-auto"
        }`}
    >
      {message.content}
    </div>
  );
};

export default MessageBubble;