const UserProfile = require("../models/userProfile");
// var User = require('../models/userAccount')

var ProfilesController = {
  ShowProfile: async (req, res) => {
    const profile = await UserProfile.findById(req.params.id)
    console.log(profile.username)
    res.render('profiles/show', { profile: profile })
  }
};

module.exports = ProfilesController;
