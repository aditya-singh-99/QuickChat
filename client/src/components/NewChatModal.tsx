import { useState } from "react";
import type { User } from "../types/User";
import type { Chat } from "../types/Chat";
import { searchUsers } from "../services/userService";
import useAuth from "../hooks/authHook";
import useChat from "../hooks/chatHook";
import useSocket from "../hooks/socketHook";
import { createChat } from "../services/chatService";
import { XMarkIcon } from "@heroicons/react/24/outline";

const NewChatModal = ({ onClose }: { onClose: () => void }) => {
  const { user: currUser } = useAuth();
  const { addNewChat, setSelectedChat } = useChat();
  const { emitChatCreation } = useSocket();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [mode, setMode] = useState<"chat" | "group">("chat");

  const handleSearch = async () => {
    try {
      const res = await searchUsers(query);
      const filteredResult = res.filter(u => u.id !== currUser?.id)
      setResults(filteredResult);
    } catch (error) {
      console.log("Error searching for users...");
    }
  };

  const handleUserSelect = async (user: User) => {
    if (mode === "group") {
      if (selected.some((u) => u.id === user.id)) {
        setSelected((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        setSelected((prev) => [...prev, user]);
      }
    } else {
      try {
        const chat = await createChat(user.id);
        chat.users = [user];
        if (currUser)
          chat.users.push(currUser);
        emitChatCreation(chat);
        updateCurrentChat(chat);
        onClose();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleCreateGroup = async () => {
    try {
      const userIds = selected.map((u) => u.id);
      const chat = await createChat(userIds, groupName);
      chat.users = selected;
      if (currUser)
        chat.users.push(currUser);
      emitChatCreation(chat);
      updateCurrentChat(chat);
      onClose();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const updateCurrentChat = (chat: Chat) => {
    addNewChat(chat);
    setSelectedChat(chat);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md shadow-xl space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white">
            {mode === "group" ? "Create Group Chat" : "New Chat"}
          </h2>
          <button onClick={onClose} className="cursor-pointer"><XMarkIcon className="size-6" /></button>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none"
        />

        {mode === "group" && (
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
          />
        )}

        <div className="flex gap-2 text-white text-sm mb-2">
          <button
            onClick={() => setMode("chat")}
            className={`px-3 py-1 rounded-full cursor-pointer ${mode === "chat" ? "bg-green-500" : "bg-slate-700"
              }`}
          >
            New Chat
          </button>
          <button
            onClick={() => setMode("group")}
            className={`px-3 py-1 rounded-full cursor-pointer ${mode === "group" ? "bg-green-500" : "bg-slate-700"
              }`}
          >
            New Group
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {results.map((user, i) => (
            <div
              key={i}
              onClick={() => handleUserSelect(user)}
              className={`cursor-pointer p-3 rounded-lg bg-slate-700 hover:bg-slate-600 ${selected.some((u) => u.id === user.id) ? "border border-green-400" : ""
                }`}
            >
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-slate-300 text-sm">{user.email}</p>
            </div>
          ))}
        </div>

        {mode === "group" && selected.length > 0 && (
          <div className="mt-4">
            <h3 className="text-white text-sm mb-2">Selected Users</h3>
            <div className="flex flex-wrap gap-2">
              {selected.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="cursor-pointer bg-green-500 hover:bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  {user.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === "group" && selected.length <= 1 && (
          <p className="text-red-400 text-sm mt-2">
            Please select at least 2 users to create a group.
          </p>
        )}
        {mode === "group" && (
          <button
            onClick={selected.length > 1 ? handleCreateGroup : undefined}
            disabled={selected.length <= 1}
            className={`w-full py-2 rounded-lg font-medium ${selected.length > 1
              ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
              : "bg-slate-600 text-slate-300 cursor-not-allowed"
              }`}
          >
            Create Group
          </button>
        )}
      </div>
    </div>
  );
};

export default NewChatModal;