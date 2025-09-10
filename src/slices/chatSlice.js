import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChat: null,
  user: JSON.parse(localStorage.getItem("userInfo")) || null,
  notification: [],
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
      }
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    addNotification: (state, action) => {
      state.notification.push(action.payload);
    },
    clearNotification: (state) => {
      state.notification = [];
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
