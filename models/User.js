const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name : {
		type : String,
		require : true,
		default : null,
	},
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
	age:{
		type:Number,
		default : null,
	},
	password:{
		type:String,
		required:true,
		min:6
	},
	batchesId:{type:Array,default:[]},
	mobile_number:{type:String,minlength:10,default : null,} 
}
);

module.exports = mongoose.model("User",UserSchema);