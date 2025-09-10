const asyncHandler = require("express-async-handler");
const Message = require("../models/Message")
const User = require("../models/User");
const Chat = require("../models/Chat");

const { cloudinaryConnect } = require("../config/cloudinary");
const cloudinary = require("cloudinary").v2;

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  console.log("📩 Backend received:", { content, chatId });

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(400).json({ message: error.message });
  }
};

const uploadImageMessage = async (req, res) => {
  const { chatId, fileBase64 } = req.body;

  if (!fileBase64 || !chatId) {
    return res.status(400).send("No file or chatId provided");
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "chat_app",
    });

    // Save message with media URL
    const message = await Message.create({
      sender: req.user._id,
      chat: chatId,
      media: result.secure_url,
    });

    const fullMessage = await Message.findById(message._id).populate(
      "sender",
      "name email"
    );

    res.status(200).json(fullMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};


module.exports = { allMessages, sendMessage,uploadImageMessage };