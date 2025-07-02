
const MessageInput = () => {
  return (
    <div className="p-4 border-t border-slate-700">
      <form className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;