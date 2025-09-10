import { useEffect, useState } from "react";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat, setChats } from "../slices/chatSlice";
import GroupChatModal from "../config/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, user, chats } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const { data } = await axios.get(
          "https://chatapp-qfdc.onrender.com/chat",
          config
        );
        dispatch(setChats(data));
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    };

    if (user) {
      setLoggedUser(user);
      fetchChats();
    }
  }, [dispatch, user, fetchAgain]);

  return (
    <div
      className={`${
        selectedChat ? "hidden md:flex" : "flex"
      } flex-col items-center p-3 bg-white w-full h-full rounded-lg border shadow-sm transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex w-full justify-between items-center pb-3 px-2 sm:px-3 text-xl sm:text-2xl md:text-[30px] font-semibold">
        <span>My Chats</span>
        <GroupChatModal>
          <button className="flex items-center text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 px-2 sm:px-3 py-1 rounded-md whitespace-nowrap">
            New Group Chat<span className="ml-1">➕</span>
          </button>
        </GroupChatModal>
      </div>

      {/* Chats list */}
      <div className="flex flex-col p-2 sm:p-3 bg-[#F8F8F8] w-full h-full rounded-lg overflow-y-auto space-y-2">
        {chats ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => dispatch(setSelectedChat(chat))}
              className={`cursor-pointer px-3 py-2 rounded-lg transition-colors duration-200 ${
                selectedChat?._id === chat._id
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              <p className="font-medium truncate">
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </p>
              {chat.latestMessage && (
                <p className="text-xs truncate">
                  <b>{chat.latestMessage.sender.name}:</b>{" "}
                  {chat.latestMessage.content.length > 50
                    ? chat.latestMessage.content.substring(0, 51) + "..."
                    : chat.latestMessage.content}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
