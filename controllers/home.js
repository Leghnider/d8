var User = require("../models/userAccount");
var Profile = require("../models/userProfile");
const bcrypt = require("bcrypt");
const Post = require("../../acebook-node-acebook_2/models/post");
const { rawListeners } = require("../models/userAccount");

var HomeController = {
  Index: function (req, res) {
    res.render("home/index", { title: "d8" });
  },

  Register: function (req, res) {
    res.render("home/register", { title: "Register" });
  },
  CreateAccount: async function (req, res) {
    const { firstName, lastName, age, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);

    var user = new User({
      firstName,
      lastName,
      age,
      email,
      password: hash,
    });

    await user.save(function (err) {
      if (err) {
        throw err;
      }
      res.status(201).redirect("/login");
    });
  },
  Login: function (req, res) {
    res.render("home/login", { title: "Log In" });
  },

  Authenticate: async function (req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.redirect("/login");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      // req.session.id = user._id;
      res.redirect("/dashboard");
    } else {
      res.redirect("/login");
    }
  },

  Logout: function (req, res) {
    // req.session.user_id = null;
    // if (res.session.user_id === null) {
    res.redirect("/login");
    // }
  },

  Dashboard: function (req, res) {
    Profile.find(async function (err) {
      if (err) {
        throw err;
      }
      const profiles = await Profile.find({}).populate("username");
      res.render("home/dashboard", { profiles: profiles, title: "Dashboard" });
    });
  },
};

module.exports = HomeController;
