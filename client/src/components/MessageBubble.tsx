
const MessageBubble = ({ message, isSender, key }: { message: string, isSender: boolean, key: React.Key }) => {
  return (
    <div
      key={key}
      className={`max-w-xs p-3 rounded-xl ${isSender ? "bg-green-500 ml-auto" : "bg-slate-700 mr-auto"
        }`}
    >
      {message}
    </div>
  );
};

export default MessageBubble;