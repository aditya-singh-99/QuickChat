import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatBox = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "instant" });
  }, [])

  return (
    <div className="h-full flex flex-col">
      
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold">Selected Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {[...Array(20)].map((_, i) => (
          <MessageBubble message={`Message ${i + 1}`} isSender={i % 2 == 0} key={i} />
        ))}
        <div ref={scrollRef}></div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatBox;
