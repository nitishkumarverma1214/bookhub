var mongoose = require("mongoose");

var user = require("./user");
var borrowSchema = new mongoose.Schema({
	
	create:{type:Date,default:Date.now},
	
	borrower:[
		{
		type:mongoose.Schema.Types.ObjectId,
		ref:"user"
	}
	]
		
	
});

module.exports = mongoose.model("Borrow", borrowSchema);
