import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { useSelector, useDispatch } from "react-redux";
import { addChat, setChats } from "../slices/chatSlice";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  // 🔹 Reset all states when closing modal
  const handleClose = () => {
    setIsOpen(false);
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
  };

  // 🔹 Add user to group
  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast.error("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // 🔹 Search users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/auth?search=${query}`,
        config
      );
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load search results");
      setLoading(false);
    }
  };

  // 🔹 Remove user from group selection
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  // 🔹 Submit and create group chat
  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const { data } = await axios.post(
        `http://localhost:4000/api/v1/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      dispatch(setChats([data, ...chats]));
      dispatch(addChat(data));
      toast.success("New Group Chat Created!");
      handleClose(); // 🔹 reset & close
    } catch (error) {
      toast.error("Failed to create chat");
    }
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={handleClose} // 🔹 close on background click
        >
          <div
            className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-2xl font-semibold">Create Group Chat</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>

            {/* Body */}
            <div className="mt-4 space-y-4">
              {/* Chat Name */}
              <input
                type="text"
                placeholder="Chat Name"
                className="w-full border rounded-lg p-2"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              {/* Search Users */}
              <input
                type="text"
                placeholder="Add Users eg: John, Piyush, Jane"
                className="w-full border rounded-lg p-2"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {/* Selected Users */}
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>

              {/* Search Results */}
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
