var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");

var jade = require("jade");
var passport = require("passport");
var localstrategy = require("passport-local").Strategy;
var Account = require("./app/models/account");

var config = require("./passport-config");
var hostname = process.env.IP || 'localhost';
var port = process.env.PORT || 3000;

//connect to database
mongoose.connect(config.url, function(err, db){
	if(err){
		console.log("Failed to connect to database", err);
	} else {
		console.log("Connected to database");
	}
});


var app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(passport.initialize());

//configure passport
passport.use(new localstrategy(Account.authenticate()));


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//routes
app.get('/', function(req,res){
	res.render("Home");
});


app.get("/logout", function(req,res){
	console.log('user logged out');
	req.logout(); //removes logged in user from req.user
	res.redirect('/');
});


app.get('/register', function(req,res){
	res.render('register');
});

app.post('/register', function(req, res, next) {
  console.log('registering user');
  if(req.body.password === req.body.confirm){
	  Account.register(new Account({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      console.log('error while registering user', err);
      return next(err);
    }

    console.log('new user registered');
    //redirect to home after register
    res.redirect('/');
  });
  }
  
  else {
	  console.log("passwords didn't match");
	  return res.json({
		  success: false,
		  message: 'Passwords did not match. Try Again'
	  })
  }
  
});

app.post('/login', passport.authenticate('local', {failureRedirect:'/', session:false}), function(req,res){
	console.log("user login " + req.user.username);
	var token = jwt.sign(req.user, config.secret);
	res.cookie('access', token);
	console.log('signed token');
	res.redirect('/user/' + req.user.username);
});


//verify token
app.use(function(req,res,next){
	var token = req.cookies.access;
	  if(token){
	   jwt.verify(token, config.secret, function(err, decoded){
		 if(err){
		   return res.json({success:false, message:'Failed to verify token'});
		 }else {
		   req.decoded = decoded;
		   console.log("token verified");
		   next(); 
		 }
	   }); 
	  }

	  else {
		return res.status(403).send({
		  success:false,
		  message:'No token provided'
		});
	  }
});
	


//protected routes
app.get('/user/:userId', function(req,res){
	res.render("userhome", {user: req.decoded._doc})
});

//delete account
app.get('/confirm', function(req,res){
	res.render('confirm', {user: req.decoded._doc})
});

app.post('/confirm', function(req,res){
	Account.findOneAndRemove({username: req.decoded._doc.username}, function(err, user){
		if(err){
			console.log('an error occured could not find user', err);
			return res.redirect('/user');
		} else{
			console.log('user account deactived', user);
			res.redirect('/logout');
		}
	});
});





app.listen(port, hostname, function(){
	console.log(`Server running at http://${hostname}:${port}`);
});