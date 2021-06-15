const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
	by : {
		type : String,
		require : false,
		default : null,
	},
	createdBy : {
		type:String,
		require: true,
		default:null
	},
	createdByName : {
		type:String,
		require: true,
		default:null
	}, 
	heading : {
		type:String,
		require:true,
		max:100,
		min :1,
	},
	subHeading : {
		type:String,
		default: "",
		max:150,
		min : 1,
	},
	priority:{
		type:Number,
		default : 2,
	},
	body:{
		type: String,
		required: true,
		max: 3000,
		default : null,
	},
	deadline:{type:Date,default:null},
	impLinks:{type:Array,default:[]},
	sectionId:{ type : String, required : true}
},
{ timestamps: true}
);

module.exports = mongoose.model("Notice",NoticeSchema);




