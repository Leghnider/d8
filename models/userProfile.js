var mongoose = require('mongoose');
// var Schema = mongoose.Schema

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
  }]
});

UserProfileSchema.statics.findOrCreate = function findOrCreate(profile, cb){
  var userObj = new this();
  this.findOne({_id : profile.id},function(err,result){ 
      if(!result){
          userObj.firstName = profile.displayName;
          //....
          userObj.save(cb);
      }else{
          cb(err,result);
      }
  });
};

var UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile; 