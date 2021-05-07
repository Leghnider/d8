const UserProfile = require("../models/userProfile");
// var User = require('../models/userAccount')

var ProfilesController = {
  ShowProfile: async (req, res) => {
    if (!req.session.user_id) {
			res.redirect("/login");
    }
    const profile = await UserProfile.findById(req.params.id)
    res.render('profiles/show', { profile: profile })
  }
};

module.exports = ProfilesController;
