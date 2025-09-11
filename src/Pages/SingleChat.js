import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Lottie from "react-lottie";
import io from "socket.io-client";
import { IoMdAttach } from "react-icons/io";

import ScrollableChat from "./ScrollableChat";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { getSender, getSenderFull } from "../config/ChatLogics";
import animationData from "../Animation/typing.json";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat, addNotification } from "../slices/chatSlice";

const ENDPOINT = "https://chatapp-server-blzi.onrender.com";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const dispatch = useDispatch();
  const { selectedChat, user, notification } = useSelector((state) => state.chat);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  // Fetch chat messages
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`${ENDPOINT}/api/v1/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch {
      toast.error("Failed to Load the Messages");
    }
  };

  // Send a new message
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `${ENDPOINT}/api/v1/message`,
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        setNewMessage("");
        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch {
        toast.error("Failed to send the Message");
      }
    }
  };

  // Upload file handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result;
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `${ENDPOINT}/api/v1/message/upload`,
          { fileBase64: base64data, chatId: selectedChat._id },
          config
        );

        const newMsg = { ...data, chat: selectedChat };

        socket.emit("new message", newMsg);
        setMessages((prev) => [...prev, newMsg]);
      } catch {
        toast.error("Failed to upload image");
      }
    };
  };

  // Socket setup
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  // Load messages when chat changes
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // Handle incoming messages
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      // If no chat selected OR it's from a different chat → notification
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.some((n) => n._id === newMessageRecieved._id)) {
          dispatch(addNotification(newMessageRecieved)); // ✅ save to redux + localStorage
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    });

    return () => {
      socket.off("message recieved");
    };
  }, [dispatch, fetchAgain, notification]);

  // Typing handler
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-2 sm:px-3 pb-3 border-b">
            <button
              className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-200"
              onClick={() => dispatch(setSelectedChat(""))}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg md:text-xl font-semibold truncate">
                {!selectedChat.isGroupChat
                  ? getSender(user, selectedChat.users)
                  : selectedChat.chatName.toUpperCase()}
              </span>
              {!selectedChat.isGroupChat ? (
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              ) : (
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              )}
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex flex-col flex-1 justify-end p-2 sm:p-3 bg-gray-200 rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700"></div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {/* Typing Indicator & Input */}
            <div className="mt-3 relative">
              {istyping && (
                <div className="absolute -top-10 left-0">
                  <Lottie options={defaultOptions} width={70} />
                </div>
              )}
              <div className="flex flex-row gap-2 items-center">
                <input
                  className="w-[70%] sm:w-[80%] p-2 sm:p-2.5 rounded-md bg-gray-300 focus:outline-none text-sm sm:text-base"
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage}
                />

                <input
                  type="file"
                  accept="image/*"
                  id="fileUpload"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <button
                  className="px-2 py-1 bg-gray-300 hover:bg-gray-200 rounded-full"
                  onClick={() => document.getElementById("fileUpload").click()}
                >
                  <IoMdAttach className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full px-4 text-center">
          <p className="text-xl sm:text-2xl font-sans pb-3">
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
