const mongoose=require("mongoose");

const message = new mongoose.Schema({
	sender:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
	},
	chat:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Chat",
	},
	content:{
		type:String,
		trim:true,
	},
	media: {
      type: String, // stores the URL or path of the uploaded image
      default: null,
    },
},
{
	timestamps:true,
}
);

module.exports = mongoose.model("Message",message);