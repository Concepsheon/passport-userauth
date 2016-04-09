var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var passport = require("passport");
var strategy = require("passport-local").Strategy;
var Account = require("./app/models/account");

var config = require("./passport-config");
var hostname = process.env.IP || 'localhost';
var port = process.env.PORT || 3000;

var app = express();

//connect to database
mongoose.connect(config.url, function(err, db){
	if(err){
		console.log("Failed to connect to database", err);
	} else {
		console.log("Connected to database");
	}
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());

passport.use(new strategy(Account.authenticate()));

//routes
app.get('/', function(req,res){
	res.send("Home");
});

app.listen(port, hostname, function(){
	console.log(`Server running at https://${hostname}:${port}`);
});