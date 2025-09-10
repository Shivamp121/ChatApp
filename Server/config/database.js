const mongoose=require("mongoose");
require("dotenv").config();
exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{console.log("db connection is successful")})
    .catch((err)=>{
        console.log("error in db connection");
        console.log(err);
        console.error(err);
        process.exit(1);
    })
}