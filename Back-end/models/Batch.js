const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
	name :{ type : String, required : true},
	description:{ type: String},
	numberofPeople:{type:Number},
	superAdmin:{type:String},
	adminId:{type:Array,default:[]},
	sectionId:{type:Array,default:[]},
	peopleId:{type:Array,default:[]}
},
{ timestamps: true}
);

module.exports=mongoose.model("Batches",BatchSchema);
