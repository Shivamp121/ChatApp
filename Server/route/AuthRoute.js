const express = require("express")
const router = express.Router()
const{signup,login,allUsers}=require("../controller/Auth");
const{protect}=require("../middleware/authMiddleware")
router.post("/login",login);
router.post("/signup",signup);
router.route("/").get(protect, allUsers);
module.exports = router