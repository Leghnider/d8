var UserProfile = require("../models/userProfile");

var UserProfileController = {
  Profile: async (res, res) => {
    res.render("users/profile", { title: "Profile" });
  },
};
