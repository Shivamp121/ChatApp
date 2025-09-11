import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupModal from "./UpdateGroupChatModal";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = useSelector((state) => state.chat);
  const [chatName, setChatName] = useState("");

  useEffect(() => {
    if (selectedChat) {
      setChatName(
        !selectedChat.isGroupChat
          ? getSender(user, selectedChat.users)
          : selectedChat.chatName
      );
    }
  }, [selectedChat, user]);

  return (
    <div className="w-full h-[94vh] md:h-[100%] bg-white rounded-md p-3 sm:p-4 md:p-5 flex flex-col shadow-sm transition-all duration-300">
      {!selectedChat ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-center">
            Chat AnyTime AnyWhere
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 h-full">
          {/* Chat Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <p className="text-lg sm:text-xl md:text-2xl font-light truncate">
              {chatName}
            </p>

            {!selectedChat.isGroupChat ? (
              <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                <button className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm sm:text-base">
                  👁
                </button>
              </ProfileModal>
            ) : (
              <UpdateGroupModal>
                <button className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm sm:text-base">
                  ⚙️
                </button>
              </UpdateGroupModal>
            )}
          </div>

          {/* Chat Body */}
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            <div className="h-full overflow-y-auto p-2 sm:p-3">
              <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
