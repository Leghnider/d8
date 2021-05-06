var UserProfile = require("../models/userProfile");

var ProfilesController = {
  Profile: async (res, res) => {
    res.render("users/profile", { title: "Profile" });
  },
};

module.exports = ProfilesController;
