var User = require("../models/userAccount");
var UserProfile = require("../models/userProfile");
const bcrypt = require("bcrypt");


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
      } else {
      // redirect this to the next registration page
      req.session.user_id = user._id
      res.status(201).redirect("/register-profile");
   } });
  },
  RegisterProfile: function (req, res) {
    res.render("home/register-profile", { title: "Register Profile" });
  },
  CreateProfile: async function (req, res) {
    const user = await User.findById(req.session.user_id);
    const { username, bio, location, gender, age, interested_in } = req.body;

    var userProfile = new UserProfile({
      username,
      bio,
      location,
      gender,
      age,
      interested_in,
      useraccount: user._id
    });

    userProfile.profileImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await userProfile.save(function(err){
      if (err) {
        throw err;
      }
      res.status(201).redirect("/home");
    });
  },
  Login: function (req, res) {
    res.render("home/login", { title: "Log In" });
  },
  Authenticate: async function (req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.redirect("/login");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      req.session.user_id = user._id;
      res.redirect('/home');
    } 
    else{
      res.redirect('/login');
    }
  },

  Dashboard: async function (req, res) {
    if (!req.session.user_id) {
			res.redirect("/login");
    }
    const user = await User.findById(req.session.user_id);

    var user_profile_details = await UserProfile.findOne({
			useraccount: { _id: req.session.user_id },
		});
    var searchResults = null; 

    if (user_profile_details.gender === "Male" && user_profile_details.interested_in[0] === "Men"){
      searchResults = await UserProfile.find({gender: 'Male', interested_in: 'Men'})
    } 
    else if (user_profile_details.gender === "Male" && user_profile_details.interested_in[0] === "Women"){
      searchResults = await UserProfile.find({gender: 'Female', interested_in: 'Men'})
    }
    else if (user_profile_details.gender === "Female" && user_profile_details.interested_in[0] === "Women"){
      searchResults = await UserProfile.find({gender: 'Female', interested_in: 'Women'})
    } 
    else if (user_profile_details.gender === "Female" && user_profile_details.interested_in[0] === "Men"){
      searchResults = await UserProfile.find({gender: 'Male', interested_in: 'Women'})
    }

    await res.render("home/dashboard", { title: "Home", userProfiles: searchResults, user: user });
    },

   Logout: function (req, res) {
    req.session.user_id = null;
    if (req.session.user_id === null) {
      res.redirect('/login');
    }
  },
};

module.exports = HomeController;
