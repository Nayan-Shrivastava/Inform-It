const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name:{type: String},
	username : {
		type:String,
		require: true,
		default:null,
		unique:true
	},
	email : {
		type:String,
		lowercase:true,

		require:true,
		max:70,
		unique:true,
	},
	age:{type:Number},
	password:{
		type:String,
		required:true,
		min:6
	},
	batchesId:{type:Array,default:[]},
	mobile_number:{type:Number,minlength:10}
}
);

module.exports = mongoose.model("User",UserSchema);