const mongoose = require("mongoose");


var MatchesSchema = new mongoose.Schema({
  userprofile: [ {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "UserProfile"
  },
],
	likes: [{ type: String }],
	like_recieved: [{ type: String }],
	matched: [{ type: String }],
});





let UserMatch = mongoose.model("UserMatch", MatchesSchema);
module.exports = UserMatch;
