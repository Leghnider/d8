var mongoose = require("mongoose");

var UserMatchSchema = new mongoose.Schema({
    user: [ { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile"}],
    liked_profiles: [ { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" } ],
    matches: [ { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" } ]
})