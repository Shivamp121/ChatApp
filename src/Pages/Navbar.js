import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../services/operation/authApi";
import toast from "react-hot-toast";
import { setChats, setSelectedChat, setNotification, clearNotification } from "../slices/chatSlice";

const Navbar = () => {
  const { user, notification } = useSelector((state) => state.chat);
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputData, setInputData] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  // Load notifications from localStorage when user logs in
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem("notifications");
      if (saved) {
        dispatch(setNotification(JSON.parse(saved)));
      }
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    const toastId = toast.loading("Loading...");
    localStorage.removeItem("notifications");
    dispatch(logout());
    window.location.href = "/";
    toast.dismiss(toastId);
  };

  const searchUser = async () => {
    const toastId = toast.loading("Loading...");
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get(
        `https://chatapp-server-blzi.onrender.com/auth/api/v1?search=${inputData}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(data);
      toast.dismiss(toastId);
    } catch (error) {
      console.error("Error searching user:", error);
      toast.dismiss(toastId);
    }
  };

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(
        "https://chatapp-server-blzi.onrender.com/api/v1/chat",
        config
      );
      dispatch(setChats(data));
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  const accessChat = async (chat) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      if (!chat.isGroupChat) {
        const { data } = await axios.post(
          "https://chatapp-server-blzi.onrender.com/api/v1/chat",
          { userId: chat._id },
          config
        );
        dispatch(setSelectedChat(data));
      } else {
        dispatch(setSelectedChat(chat));
      }

      await fetchChats();
      setIsSidebarOpen(false);
      setShowNotifications(false);

      // Remove notification
      dispatch(clearNotification(chat._id));
      localStorage.setItem(
        "notifications",
        JSON.stringify(notification.filter((n) => n.chat._id !== chat._id))
      );
    } catch (error) {
      toast.error("Error fetching the chat: " + error.message);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="p-2 w-full flex justify-between items-center border-gray-300 border-b bg-white h-[60px] relative">
        {/* Search */}
        <div
          className="cursor-pointer flex rounded-md px-2 items-center hover:bg-gray-200 gap-2 font-semibold w-auto sm:w-[10%]"
          onClick={() => setIsSidebarOpen(true)}
        >
          <CiSearch className="text-xl" />
          <p className="hidden md:block">Search User</p>
        </div>

        {/* Title */}
        <div className="flex justify-center">
          <h1 className="talkative text-xl sm:text-2xl md:text-3xl font-bold">
            Talk-A-Tive
          </h1>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 relative">
          {/* Bell Icon */}
          <div className="relative">
            <FaBell
              className="cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {notification.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {notification.length}
              </span>
            )}

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-md z-50 max-h-72 overflow-y-auto">
                {notification.length === 0 ? (
                  <p className="p-3 text-gray-500 text-sm">
                    No new notifications
                  </p>
                ) : (
                  notification.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => accessChat(notif.chat)}
                      className="p-3 border-b hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {notif.chat.isGroupChat
                        ? `New message in ${notif.chat.chatName}`
                        : `New message from ${notif.sender?.name}`}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm sm:text-base hover:text-red-600"
          >
            Logout
          </button>

          {/* Profile */}
          <div className="flex gap-1 sm:gap-2 items-center">
            {user?.pic && (
              <img
                src={user.pic}
                alt={user.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border"
              />
            )}
            <MdKeyboardArrowDown className="hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Sidebar Search */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] md:w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="font-bold text-lg">Search Users</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-2xl">
            &times;
          </button>
        </div>

        <div className="p-4 flex gap-2">
          <input
            type="text"
            placeholder="Search for users..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="w-full border p-2 rounded-md text-sm"
          />
          <button
            onClick={searchUser}
            className="px-3 rounded-md py-1 bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Go
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
          {users.length > 0 ? (
            users.map((u) => (
              <div
                key={u._id}
                onClick={() => accessChat(u)}
                className="flex items-center gap-3 p-2 border-b cursor-pointer hover:bg-gray-100"
              >
                <img
                  src={u.pic}
                  alt={u.name}
                  className="w-10 h-10 rounded-full border"
                />
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No user found</p>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
