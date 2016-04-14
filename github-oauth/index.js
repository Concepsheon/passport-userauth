var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var router = require("./routes");

var host = 'localhost';
var port = 3000;
mongoose.connect("mongodb://localhost:27017/test", function(err,db){
	if(err){
		console.log('failed to connect to mongodb', err);
	} else {
		console.log("connected to mongodb");
	}
})

var app = express();
app.use(morgan('dev'));
app.use('/', router);

app.listen(port, host, function(){
	console.log(`Server running http://${host}:${port}`);
}) 