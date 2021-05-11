var mongoose = require('mongoose');

var PersonalitySchema = new mongoose.Schema({
  userprofile: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserProfile"
      },
  ],
  q1: {
      type: String
  },
  q2: {
    type: String
  },
  q3: {
    type: String
  },
  q4: {
    type: String
  },
  q5: {
    type: String
  },    
});

var PersonalityQuestionnaire = mongoose.model('PersonalityQuestionnaire', PersonalitySchema);
module.exports = PersonalityQuestionnaire;
