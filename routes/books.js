var express=require("express");
router = express.Router({mergeParams:true});
var book = require("../models/book");
var user = require("../models/user");



router.get('/',function(req,res){
	book.find({},function(err,allbooks){
		if(err){
			console.log(err);
		}else{
			res.render("index",{books:allbooks, currentuser:req.user});
			
		}
	});
});

router.post('/',isloggedin,function(req,res){
	//res.send("you hit the post route");
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author={
		id : req.user._id,
		username: req.user.username
		
	};
	var newBook = {name:name,image:image,description:desc,author:author};
	//(newBook);
	console.log(req.user.username);
	book.create(newBook,function(err, newlycreated){
		if(err){
			console.log(err);
		}else{
			res.redirect('/books');
		}
	});
});
	
	


router.get('/new',isloggedin,function(req,res){
	res.render("newbooks");
});

router.get('/:id',function(req,res){
	book.findById(req.params.id).populate("comments").exec(function(err,foundbook){
		if(err){
			console.log(err);
		}else{
			res.render("show",{book:foundbook});	
		}								 
	});
    
});
//edit 

router.get("/:id/edit",checkbook,function(req,res){		book.findById(req.params.id,function(err,foundbook){
	res.render("edit",{book:foundbook});			
});
	
	
	
});
//update 
router.put("/:id",checkbook,function(req,res){
	book.findByIdAndUpdate(req.params.id,req.body.book,function(err,updatedbook){
		if(err){
			console.log(err);
			res.redirect("/books");
		}else{
			res.redirect("/books/"+req.params.id);
		}
	});
});
//destroy
router.delete("/:id",checkbook,function(req,res){
	book.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
			res.redirect("/books");
		}else{
			res.redirect("/books");
		}
	});
});
function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect("/login");
	}
}

function checkbook(req,res,next){
	if(req.isAuthenticated()){
		book.findById(req.params.id,function(err,foundbook){
		if(err){
			console.log(err);
			res.redirect("/books");
		}else{
			if(foundbook.author.id.equals(req.user._id)){
			next();
			}
			else{
				res.redirect("back");
			}
		}
	});
	}else{
		res.redirect("back");
	}
}

module.exports= router;