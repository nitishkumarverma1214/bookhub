var mongoose = require("mongoose");
var comment = require("./comment");
var user = require("./user");
var borrow =require("./borrow");
var bookSchema = new mongoose.Schema({
	name:String,
	image:String,
	description: String,
	author:{
		id:{
		type: mongoose.Schema.Types.ObjectId,
		ref:"user"
		},
		username:String
		
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:"comment"
		}
	],
	
	lend: [{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Borrow"
	}]
		
	
	
});

module.exports = mongoose.model("book", bookSchema);
