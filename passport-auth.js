var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var passport = require("passport");
var localstrategy = require("passport-local").Strategy;
var Account = require("./app/models/account");

var config = require("./passport-config");
var hostname = process.env.IP || 'localhost';
var port = process.env.PORT || 3000;

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(passport.initialize());

//configure passport
passport.use(new localstrategy(Account.authenticate()));

//connect to database
mongoose.connect(config.url, function(err, db){
	if(err){
		console.log("Failed to connect to database", err);
	} else {
		console.log("Connected to database");
	}
});

//routes
app.get('/', function(req,res){
	res.send("Home");
});

app.post('/register', function(req, res, next) {
  console.log('registering user');
  Account.register(new Account({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');

    res.redirect('/');
  });
});


app.listen(port, hostname, function(){
	console.log(`Server running at https://${hostname}:${port}`);
});