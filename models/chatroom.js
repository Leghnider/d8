var mongoose = require('mongoose');

var ChatRoomSchema = new mongoose.Schema({
roomname: [String],

users: [ { 
  type: mongoose.Schema.Types.ObjectId,
  ref: "UserProfile"

}],

history: {

}

})

var ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
module.exports = ChatRoom;