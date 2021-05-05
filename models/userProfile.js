var mongoose = require('mongoose');

var UserProfileSchema = new mongoose.Schema({
  userAccount:{
    type: mongoose.Schema.Types.ObjectId, ref: "userAccount",
  }, 
  profilePicture: [{
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
  }]
})

var userProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = userProfile; 