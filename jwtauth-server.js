var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');

var config = require('./config');
var Account = require('./app/models/account');
var app = express();

var port = process.env.PORT || 3000;
var hostname = process.env.IP || 'localhost';

var db = mongoose.connect(config.url); //connect to databse with url fom config file
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

//unprotected routes

app.get('/', function(req,res) {
  res.send('Home: http://' + hostname + ':' + port + '/api');
});

app.post('/setup', function(req,res){
  //create new user with mongoose model
  var nick = new Account({
    name: req.body.name,
    password: req.body.password,
    admin:true
  });
  //save user
  nick.save(function(err){
    if(err) throw err;
    
    console.log('User saved');
    res.json({
      success:true,
      newUser: nick
    });
  });
});


var apiRouter = express.Router();

//authentication route that accepts username and password if they validate token returned
//token stored on client side and passed to server on every request to server

apiRouter.post('/authenticate', function(req,res){
  Account.findOne({
    name:req.body.name
  }, function(err,user){
    if(err) throw err;
    if(!user){
      res.json({success:false, message:"Authentication failed. User not found."});
    } else if(user){
      if(user.password != req.body.password){
        res.json({sucess:false, message: 'Authentication failed. Wrong password.'});
      }else {
        var token = jwt.sign(user, config.secret, {expiresIn: '24h'});
        res.json({
          session:true,
          message:'Your token below',
          token: token
        });
      }
    }
  });
});



//route middleware to verify a token
apiRouter.use(function(req,res,next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token){
   jwt.verify(token, config.secret, function(err, decoded){
     if(err){
       return res.json({success:false, message:'Failed to verify token'});
     }else {
       req.decoded = decoded;
       next(); //app uses this function to verify JWT and passes to route(next middleware)
     }
   }); 
  } else {
    return res.status(403).send({
      success:false,
      message:'No token provided'
    });
  }
});



//protected routes, require JWT for access
apiRouter.get('/', function(req, res){
  res.json({message: 'Welcome to REST API'});
});

apiRouter.get('/users', function(req,res){
  Account.find({}, function(err, users){
    if(err) throw err;

    res.json(users);
  });
});




app.use('/api', apiRouter);



app.listen(port,hostname, function(){
  console.log(`Server running on http://${hostname}:${port}`);
});
