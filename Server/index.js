const express = require("express");
const app = express();

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

require("dotenv").config();
const PORT = process.env.PORT || 4000;

// ---- CORS CONFIG ----
const corsOptions = {
  origin: [
    "https://chat-app-three-gamma-91.vercel.app", // frontend deployed
    "http://localhost:3000", // local dev
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

// ---- Middlewares ----
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// ---- Cloudinary ----
cloudinaryConnect();

// ---- Routes ----
const authRoutes = require("./route/AuthRoute");
const ChatRoute = require("./route/ChatRoute");
const messageRoute = require("./route/MessageRoute");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", ChatRoute);
app.use("/api/v1/message", messageRoute);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running",
  });
});

// ---- Server ----
const server = app.listen(PORT, () => {
  console.log(`App is running at port no. ${PORT}`);
});

// ---- Socket.io ----
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "https://chat-app-three-gamma-91.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // setup
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id; // save for disconnect
    socket.emit("connected");
  });

  // join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // typing indicators
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // handle new message
  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id.toString() === newMessageRecieved.sender._id.toString()) {
        return;
      }
      socket.in(user._id.toString()).emit("message recieved", newMessageRecieved);
    });
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
    if (socket.userId) socket.leave(socket.userId);
  });
});

// ---- Connect to DB ----
database.connect();
