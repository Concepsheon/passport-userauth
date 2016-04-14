var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = new Schema({
	username: String,
	OauthId: String,
	publicRepos: Number
});

module.exports = mongoose.model('User', User);