var UserAccount = require("../models/userAccount");

var HomeController = {
  Index: function (req, res) {
    res.render("home/index", { title: "d8" });
  },

  Login: function (req, res) {
    res.render("home/login", { title: "Log In" });
  },

  Logout: function (req, res) {
    req.session.user_id = null;
    if (res.session.user_id === null) {
      res.redirect("/login");
    }
  },
};

module.exports = HomeController;
