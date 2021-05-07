var mongoose = require('mongoose');
// var Schema = mongoose.Schema

var UserProfileSchema = new mongoose.Schema({
  author: [ {
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
  }]
})

var UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile; 