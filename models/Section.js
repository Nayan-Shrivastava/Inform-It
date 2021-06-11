const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
	name :{ type : String, required : true},
	description:{ type: String},
	noticeId:{type:Array,default:[]},
	batchId:{ type : String, required : true}
},
{ timestamps: true}
);

module.exports=mongoose.model("Sections",SectionSchema);
