import { useState } from "react";
import { XMarkIcon, UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import useChat from "../hooks/chatHook";
import useAuth from "../hooks/authHook";
import { searchUsers } from "../services/userService";
import type { User } from "../types/User";
import { addUserToGroup, removeUserFromGroup } from "../services/chatService";
import useSocket from "../hooks/socketHook";

const ManageGroupModal = ({ onClose }: { onClose: () => void }) => {
  const { user: currentUser } = useAuth();
  const { chats, setChats, selectedChat, setSelectedChat } = useChat();
  const { emitAddMember, emitRemoveMember } = useSocket();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  if (!selectedChat) return null;

  const isAdmin = selectedChat.adminId === currentUser?.id;

  const handleSearch = async () => {
    try {
      const results = await searchUsers(searchTerm);
      const filtered = results.filter(u => !selectedChat.users.find(user => user.id === u.id));
      setSearchResults(filtered);
    } catch (error) {
      alert("Error searching users...");
    }
  };

  const handleAdd = async (userToAdd: User) => {
    try {
      const updatedChat = await addUserToGroup(selectedChat.id, userToAdd.id);
      emitAddMember(userToAdd, selectedChat);
      setSelectedChat({ ...selectedChat, users: updatedChat.users });
      setChats(chats.map(chat => chat.id === updatedChat.id ? { ...chat, users: updatedChat.users } : chat));
      setSearchResults([]);
      setSearchTerm("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRemove = async (userToRemove: User) => {
    try {
      const updatedChat = await removeUserFromGroup(selectedChat.id, userToRemove.id);
      emitRemoveMember(userToRemove, selectedChat);
      setSelectedChat({ ...selectedChat, users: updatedChat.users });
      setChats(chats.map(chat => chat.id === updatedChat.id ? { ...chat, users: updatedChat.users } : chat));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-slate-800 text-white w-full max-w-2xl p-8 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Group Members</h2>
          <XMarkIcon onClick={onClose} className="w-6 h-6 cursor-pointer text-slate-400 hover:text-white" />
        </div>

        {/* Group Members List */}
        <div className="space-y-2 max-h-64 overflow-y-auto border-b border-slate-600 pb-2">
          {selectedChat.users.map((member) => {
            const isMemberRemovable =
              isAdmin &&
              member.id !== selectedChat.adminId &&
              selectedChat.users.length > 3;

            return (
              <div
                key={member.id}
                className="flex justify-between items-center p-3 bg-slate-700 rounded-md"
              >
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-slate-300">{member.email}</p>
                </div>
                {selectedChat.adminId === member.id ? (
                  <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-md">ADMIN</span>
                ) : isAdmin ? (
                  <UserMinusIcon
                    onClick={() => {
                      if (isMemberRemovable) handleRemove(member);
                    }}
                    className={`w-5 h-5 ${isMemberRemovable
                        ? "text-red-400 hover:text-red-500 cursor-pointer"
                        : "text-gray-500 cursor-not-allowed"
                      }`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Warning if admin and only 3 users total */}
        {isAdmin && selectedChat.users.length === 3 && (
          <p className="text-red-400 text-sm mt-2">
            A group must have at least 3 members (including admin).
          </p>
        )}

        {/* Add Users */}
        {isAdmin && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search users to add"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-2 rounded-md bg-slate-700 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-3 bg-slate-700 rounded-md"
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-slate-300">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleAdd(user)}
                    className="p-2 bg-green-500 hover:bg-green-600 rounded-md cursor-pointer"
                  >
                    <UserPlusIcon className="size-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageGroupModal;