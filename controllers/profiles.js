const UserProfile = require("../models/userProfile");
const User = require('../models/userAccount')

var ProfilesController = {
  ShowProfile: async (req, res) => {
    const profile = await UserProfile.findById(req.params.id)
    const user = await User.findById(profile.useraccount)
    const email = await user.email
    res.render('profiles/show', { profile: profile, email: email })
  }
};

module.exports = ProfilesController;
