var UserProfiles = require("../models/userProfile");

var ProfilesController = {
  Profile: async (res, res) => {
    res.render("users/profiles", { title: "Profiles" });
  },
};

module.exports = ProfilesController;
