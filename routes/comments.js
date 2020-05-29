var express=require("express");
router = express.Router({mergeParams:true});
var book = require("../models/book");
var comment = require("../models/comment");
var user= require("../models/user");
router.get('/new',isloggedin,function(req,res){
	book.findById(req.params.id,function(err,book){
		if(err){
			console.log(err);
		}else{
			res.render("newcomments",{book:book})
		}
	})
	
});

router.post('/',isloggedin,function(req,res){
	book.findById(req.params.id,function(err,book){
		if(err){
			console.log(err);
		}
		else{
		comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
					res.redirect('/show');
				}else{
					
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;			
					comment.save();
					book.comments.push(comment);
					book.save();
					res.redirect('/books/'+book._id);
				}
			});
		}
	})
});


function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		res.render("register");
	}
}

module.exports= router;