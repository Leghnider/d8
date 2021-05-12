var mongoose = require("mongoose");

var ChatHistorySchema = new mongoose.Schema(
  {
    conversation_id: {
      type: String,
    },
    chat_history: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

var ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);
module.exports = ChatHistory;
