import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChat: null,
  user: JSON.parse(localStorage.getItem("userInfo")) || null,
  notification: JSON.parse(localStorage.getItem("notifications")) || [], // ✅ load saved notifications
  chats: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("notifications"); // ✅ clear notifications when logout
        state.notification = [];
      }
    },

    setNotification: (state, action) => {
      state.notification = action.payload;
      localStorage.setItem("notifications", JSON.stringify(state.notification)); // ✅ persist
    },

    addNotification: (state, action) => {
      state.notification.push(action.payload);
      localStorage.setItem("notifications", JSON.stringify(state.notification)); // ✅ persist
    },

    clearNotification: (state) => {
      state.notification = [];
      localStorage.removeItem("notifications"); // ✅ remove from storage
    },

    // replace chats (used when fetching from backend)
    setChats: (state, action) => {
      state.chats = action.payload;
    },

    // append a new chat safely
    addChat: (state, action) => {
      const exists = state.chats.find((c) => c._id === action.payload._id);
      if (!exists) {
        state.chats.unshift(action.payload); // add to top
      }
    },
  },
});

export const {
  setSelectedChat,
  setUser,
  setNotification,
  addNotification,
  clearNotification,
  setChats,
  addChat,
} = chatSlice.actions;

export default chatSlice.reducer;
