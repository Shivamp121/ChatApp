import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../services/operation/authApi";
import toast from "react-hot-toast";
import { setChats, setSelectedChat } from "../slices/chatSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.chat);
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputData, setInputData] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    const toastId = toast.loading("Loading...");
    dispatch(logout());
    window.location.href = "/";
    toast.dismiss(toastId);
  };

  const searchUser = async () => {
    const toastId = toast.loading("Loading...");
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/auth?search=${inputData}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        "http://localhost:4000/api/v1/chat",
        config
      );
      dispatch(setChats(data));
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  const accessChat = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/chat",
        { userId },
        config
      );
      dispatch(setSelectedChat(data));
      await fetchChats();
      setIsSidebarOpen(false);
    } catch (error) {
      toast.error("Error fetching the chat: " + error.message);
    }
  };

  return (
    <>
      <div className="p-2 w-full flex justify-between items-center border-gray-300 border-b bg-white h-[60px]">
        <div
          className="cursor-pointer flex rounded-md px-2 items-center hover:bg-gray-200 gap-2 font-semibold w-auto sm:w-[10%]"
          onClick={() => setIsSidebarOpen(true)}
        >
          <CiSearch className="text-xl" />
          <p className="hidden md:block">Search User</p>
        </div>

        <div className="flex justify-center">
          <h1 className="talkative text-xl sm:text-2xl md:text-3xl font-bold">
            Talk-A-Tive
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <FaBell className="hidden sm:block cursor-pointer" />
          <button
            onClick={handleLogout}
            className="text-sm sm:text-base hover:text-red-600"
          >
            Logout
          </button>
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
                onClick={() => accessChat(u._id)}
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
