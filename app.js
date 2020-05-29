var express = require("express");
var app= express();
var bodyParser= require("body-parser");
var mongoose = require("mongoose");
var book = require("./models/book");
var seeddb= require("./seed");
var comment = require("./models/comment");
var passport = require("passport");
var localstrategy = require("passport-local");
var user = require("./models/user");
var methodoverride=require("method-override")
var commentRoutes = require("./routes/comments"),
	bookRoutes = require("./routes/books"),
	indexRoutes = require("./routes/index")


mongoose.connect("mongodb://localhost/book_hub",{useNewUrlParser: true });
var book = require("./models/book");
var comment = require("./models/comment");
var data=[
	{
	  name:"The 5am Club",
	  image:"https://images-na.ssl-images-amazon.com/images/I/714-1kZwslL.jpg",
		description:"Legendary leadership and elite performance expert Robin Sharma introduced The 5am Club concept over twenty years ago, based on a revolutionary morning routine that has helped his clients maximize their productivity, activate their best health and bulletproof their serenity in this age of overwhelming complexity."
	},
	{
	  name:"the monk who sold his ferrari",
	  image:"https://images-na.ssl-images-amazon.com/images/I/410BqHSamiL._SX322_BO1,204,203,200_.jpg",
		description:"The book is about the inspiring journey of Julius Mantle, a wildly successful attorney, who travels to the Himalayas in search of spiritual peace in his out-of-balance life. The book is written in the form of a conversation between two friends; hence it is neither very preachy nor soporific!"
	},
	{
	  name:"you can win",
	  image:"https://images-na.ssl-images-amazon.com/images/I/419EgzNgvNL._SX318_BO1,204,203,200_.jpg",
		description:"The very first chapter leaves the reader hankering for another dose of positive attitude and a brighter approach towards life. So, what are the different approaches to accomplish that single motive in life i.e to win and succeed. The author focuses on steps to build a positive attitude in life."
	}
	
];

function seeddb(){
	book.remove({},function(err){
	  if(err){
		console.log(err);
	 }else{
		console.log("removed from database");
	 }
		data.forEach(function(seed){
			book.create(seed,function(err,book){
			  if(err){
				  console.log(err);
			  }	else{
				  console.log("created;");
				  //create comments
				  comment.create ({
					  text:"this book is great",
					  author: "homor"
				  }, function(err,comment){
					  if(err){
						  console.log(err);
					  }else{
						  book.comments.push(comment);
						  book.save();
						  console.log("created a new comment");
					  }
				  });
			  }
			});
		});
		
	
});
}


module.exports = seeddb;


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
//seeddb();
app.use(require("express-session")({
	secret:"dheeraj",
	resave: false,
	saveUnintialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(methodoverride("_method"));
app.use(function(req,res,next){
	res.locals.currentuser=req.user;
	next();
});

app.use("/books/:id/comments",commentRoutes);
app.use("/books",bookRoutes);
app.use("/",indexRoutes);


app.listen(3000,function(){
	console.log("connected");
});