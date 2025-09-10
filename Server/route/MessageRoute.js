const express = require("express");
const {
  allMessages,
  sendMessage,
  uploadImageMessage,
} = require("../controller/MessageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.post("/upload", protect, uploadImageMessage);
module.exports = router;