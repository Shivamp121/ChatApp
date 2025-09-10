const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../Utils/imageUploader");
const jwt=require("jsonwebtoken");
exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log("REQ FILES:", req.files);
console.log("REQ BODY:", req.body);
    // 1. Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Handle image upload
    console.log("REQ FILES:", req.files);
    let imageUrl = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"; // default
    if (req.files && req.files.pic) {
      const image = req.files.pic; // "pic" should match <input name="pic" />
      const uploadedImage = await uploadImageToCloudinary(
        image,
        process.env.FOLDER_NAME
      );
      console.log("uploaded image",uploadedImage)
      imageUrl = uploadedImage.secure_url;
      console.log("consoling imagessssss",imageUrl)
    }

    // 5. Create user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      pic: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be created. Please try again later",
    });
  }
};
exports.login=async (req,res)=>{
   try{

     //fetch email and password from req body

    const{email,password}=req.body;

    //validata the data

    if(!email||!password){
        return res.status(403).json({
            success:false,
            message:"All fields are required"
        })
    }

    //check user exists

    const user=await User.findOne({email});

    if(!user){
         return res.status(401).json({
            success:false,
            message:"User does not exist"
        })
    }

    //create jwt after password matching
  
    if(await bcrypt.compare(password,user.password)){
        const payload={
            email:user.email,
            id:user._id,
            accountType:user.accountType,
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
        });
        user.token=token;
        user.password=undefined;

        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }

        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"User Logged in Successfully",
        })

    }

    else{
        return res.status(401).json({
            success:false,
            message:"Password do not match",
        })
    }

    //create cookie and send in response

   }catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Login failure,Please try again later"
    })

   }

}
exports.allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};
