var mongoose = require('mongoose');
// var Schema = mongoose.Schema
var _ = require("lodash")

var UserProfileSchema = new mongoose.Schema({
  useraccount: [ {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "UserAccount"
  },
], 
  // profilePicture: [{
  //   url: String,
  //   filename: String
  // }],
  bio:{
    type: String
  },
  username: {
    type: String
  },
  location: {
    type: String
  },
  gender:{
    type: String
  },
  age:{
    type: Number
  },
  interested_in:[{
    type: String,
  }],
  liked: [{ type: String }]

})

UserProfileSchema.pre('save', function (next) {
	console.log([...this.liked])
  this.liked = _.uniq(this.liked.map((like) => like.toString()));
	console.log(this.liked)
  next();
});



var UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile; 