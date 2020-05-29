var express=require("express");
router = express.Router({mergeParams:true});
var passport=require("passport");
var user = require("../models/user");

router.get('/',function(req,res){
	res.render("landing");
});

router.get("/register",function(req,res){
	res.render("register");
});
router.post("/register",function(req,res){
	var newuser= new user({username: req.body.username});
	user.register(newuser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/books");
		});
	});
});

router.get("/about",(req,res)=>{
	res.render("about");
});

router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local",{
	successRedirect:"/books",
	failureRedirect:"/login"
}),function(req,res){
	
});
router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/books");
});

function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		res.render("register");
	}
}



module.exports = router;