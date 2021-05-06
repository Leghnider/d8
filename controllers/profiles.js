//var UserProfiles = require("../models/userProfile");
var User = require('../models/userAccount')

var ProfilesController = {
  UserProfile: async (req, res) => {
    if (!req.session.user_id) {
			res.redirect("/login");
    }
    const user = await User.findById(req.session.user_id);
    res.render("profiles/index", { title: "Profiles", user: user });
  },
  EditProfile: async (req, res) => {
    if (!req.session.user_id){
      res.redirect('/login')
    }
    const user = await User.findById(req.session.user_id);
    res.render('profiles/edit', { title: 'Edit Profile', user: user});
  },


};

module.exports = ProfilesController;
