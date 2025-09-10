import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat, setChats } from "../slices/chatSlice";

const UpdateGroupModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, selectedChat, chats } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const isAdmin = selectedChat?.groupAdmin?._id === user?._id;

  const handleRename = async () => {
    if (!groupChatName) return;
    if (!isAdmin) {
      toast.error("Only admins can rename the group");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      dispatch(setSelectedChat(data));
      toast.success("Group name updated!");
      setIsOpen(false);
    } catch {
      toast.error("Failed to rename group");
    }
  };

  const handleRemove = async (userToRemove) => {
    if (!isAdmin && userToRemove._id !== user._id) {
      toast.error("Only admins can remove someone");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/chat/groupremove`,
        { chatId: selectedChat._id, userId: userToRemove._id },
        config
      );
      if (userToRemove._id === user._id) {
        dispatch(setSelectedChat(null));
        dispatch(setChats(chats.filter((c) => c._id !== selectedChat._id)));
        toast.success("You left the group");
      } else {
        dispatch(setSelectedChat(data));
        toast.success("User removed");
      }
    } catch {
      toast.error("Failed to remove user");
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (!isAdmin) {
      toast.error("Only admins can add users");
      return;
    }
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.error("User already in group");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/chat/groupadd`,
        { chatId: selectedChat._id, userId: userToAdd._id },
        config
      );
      dispatch(setSelectedChat(data));
      toast.success("User added!");
    } catch {
      toast.error("Failed to add user");
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/auth?search=${query}`,
        config
      );
      setSearchResult(data);
      setLoading(false);
    } catch {
      toast.error("Failed to load search results");
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-2xl font-semibold">
                {selectedChat.chatName}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                  admin={selectedChat.groupAdmin._id}
                />
              ))}
            </div>
            {isAdmin && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="New Group Name"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <button
                  onClick={handleRename}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg"
                >
                  Rename
                </button>
              </div>
            )}
            {isAdmin && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Add users"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {loading ? (
                  <p className="text-gray-500 text-center">Loading...</p>
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((u) => (
                      <UserListItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleAddUser(u)}
                      />
                    ))
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleRemove(user)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupModal;
