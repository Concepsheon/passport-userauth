var express = require("express");
var router = express.Router();
var User = require("./user");
var config = require("./config");
var passport = require("passport");
var Strategy = require("passport-github2").Strategy;

router.use(passport.initialize());
passport.use(new Strategy({
	clientID: config.clientId,
	clientSecret: config.clientSecret,
	callbackURL: config.URL
},
function(token, refreshToken, profile, done){
	User.findOne({'OauthId': profile.id}, function(err, user){
		if(err){
			return done(err);
		}
		if(user !== null){
			return done(null, user);
		} else {
			var user = new User({
				username: profile.name,
				OauthId : profile.id,
			    publicRepos : profile._json.public_repos
			});
			user.save(function(err){
				if(err){
					console.log(err);
				} else{
					console.log('saving user');
					done(null, user);
				}
			});
		}
	});
}));

router.get('/',function(req,res){
  res.json({
    success: true
  })
});

router.get('/github', passport.authenticate('github'));

router.get('/github/user/callback', passport.authenticate('github', {session:false}), function(req,res){
	res.json({
		success: true,
		user: req.user
	});
});

module.exports = router;