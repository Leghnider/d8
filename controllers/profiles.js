const UserProfile = require("../models/userProfile");
const User = require('../models/userAccount')

var ProfilesController = {
  ShowProfile: async (req, res) => {
    if (!req.session.user_id) {
			res.redirect("/login");
    }
    const profile = await UserProfile.findById(req.params.id)
    const user = await User.findById(profile.useraccount)
    const email = await user.email
    res.render('profiles/show', { profile: profile, email: email })
  }
};

module.exports = ProfilesController;
