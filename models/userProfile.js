var mongoose = require('mongoose');

var UserProfileSchema = new mongoose.Schema({
  useraccount: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "UserAccount"
    },
  ], 
  profileImages: [{
    url: String,
    filename: String
  }],
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
  liked: [{ type: String }],
  likes_received: [{type: String}],
  matched: [{ type: String }]
  //   liked: [{
  //     type: mongoose.Schema.Types.ObjectId, 
  //     ref: "UserProfile"
  //   },],
  // likes_received: [{
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: "UserProfile"
  // },],
  // matched: [{
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: "UserProfile"
  // },]

})

var UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile 