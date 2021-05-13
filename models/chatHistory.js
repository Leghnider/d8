var mongoose = require("mongoose");

var ChatHistorySchema = new mongoose.Schema({
  chat: 
    [{
  chat_history: {
    type: [String],
    trim: true,
  },
 
    userprofile: {type: mongoose.Schema.Types.String, ref: "UserProfile"},
    }],
    conversation_id: [{
      type: String,
    }],
  },
 
  {
    timestamps: true,
  }
);

var ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);
module.exports = ChatHistory;
