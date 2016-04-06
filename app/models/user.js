var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  name: {
   type: String,
   unique: true,
   required: true
  },
  password: {
   type: String,
   required: true
  },
  admin: Boolean
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
