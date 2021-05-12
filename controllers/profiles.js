const UserProfile = require("../models/userProfile");
const User = require('../models/userAccount')
const PersonalityQuestionnaire = require('../models/personalityQuestionnaire')

var ProfilesController = {
  ShowProfile: async (req, res) => {
    if (!req.session.user_id) {
			res.redirect("/login");
    }
    const profile = await UserProfile.findById(req.params.id)
    const user = await User.findById(profile.useraccount)
    const questionsAnswers = await PersonalityQuestionnaire.findOne({userprofile: {_id: profile._id}})
    const email = await user.email
    res.render('profiles/show', { profile: profile, email: email, questionsAnswers: questionsAnswers })
  }
};

module.exports = ProfilesController;
