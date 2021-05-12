var User = require("../models/userAccount");
var UserProfile = require("../models/userProfile");
var PersonalityProfile = require("../models/personalityQuestionnaire");
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
        req.session.user_id = user._id;
        res.status(201).redirect("/register-profile");
      }
    });
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
      useraccount: user._id,
    });

    userProfile.profileImages = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    await userProfile.save(function (err) {
      if (err) {
        throw err;
      }
      res.status(201).redirect("/register-personality-questionnaire");
    });
  },

  PersonalityPage: function (req, res) {
    res.render("home/personality-questionnaire", {
      title: "Further Information",

    });
  },

  PersonalityQuestionnaire: async function(req, res) {
    const user = await User.findById(req.session.user_id);
    const userProfile = await UserProfile.findOne({
      useraccount: req.session.user_id,
    })

    console.log(userProfile._id)
    const { q1, q2, q3, q4, q5 } = req.body;

    var personalityProfile = new PersonalityProfile ({
      userprofile: userProfile._id,  
      q1,
      q2,
      q3,
      q4,
      q5
    });
    await personalityProfile.save(function(err) {
      if(err) {
        throw err
      }
      res.status(201).redirect('/home')
    })
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
      res.redirect("/home");
    } else {
      res.redirect("/login");
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

    var likedBlockedBlockedBy = user_profile_details.liked.concat(user_profile_details.blocked_by, user_profile_details.blocked)

    if (user_profile_details.gender === "Male" && user_profile_details.interested_in[0] === "Men"){
      searchResults = await UserProfile.find({ 
        _id: { $ne: user_profile_details._id, $nin: likedBlockedBlockedBy},
        gender: 'Male', 
        interested_in: 'Men' })
    } 
    else if (user_profile_details.gender === "Male" && user_profile_details.interested_in[0] === "Women"){
      searchResults = await UserProfile.find({ 
        _id: { $nin: user_profile_details.liked, $nin: likedBlockedBlockedBy },
        gender: 'Female', 
        interested_in: 'Men' })
    }
    else if (user_profile_details.gender === "Female" && user_profile_details.interested_in[0] === "Women"){
      searchResults = await UserProfile.find({ 
        _id: { $ne: user_profile_details._id, $nin: likedBlockedBlockedBy },
        gender: 'Female', 
        interested_in: 'Women' })
    } 
    else if (user_profile_details.gender === "Female" && user_profile_details.interested_in[0] === "Men"){
      searchResults = await UserProfile.find({
        _id: { $nin: user_profile_details.liked, $nin: likedBlockedBlockedBy },
        gender: 'Male', 
        interested_in: 'Women'})
    }

    await res.render("home/dashboard", { title: "Home", userProfiles: searchResults, user: user });
  },
  Filter: async(req, res) => {
    var minage = 18;
    var maxage = 100;
  
    if (req.query.minage !== ""){
      minage = Number(req.query.minage)
    }
    if (req.query.maxage !== ""){
      maxage = Number(req.query.maxage)
    }
    if (req.query.location === undefined){
      var locationQuery = ["North London", "West London", "South London", "East London"];
    } else {
      locationQuery= req.query.location;
    }

    const user = await User.findById(req.session.user_id);

    var user_profile_details = await UserProfile.findOne({
			useraccount: { _id: req.session.user_id },
		});
    var searchResults = null; 

    var likedBlockedBlockedBy = user_profile_details.liked.concat(user_profile_details.blocked_by, user_profile_details.blocked)

    if (user_profile_details.gender === "Male" && user_profile_details.interested_in[0] === "Men"){
      searchResults = await UserProfile.find({
        _id: { $ne: user_profile_details._id, $nin: likedBlockedBlockedBy },
        gender: 'Male',
        interested_in: 'Men', 
        age: {$gte: minage, $lte: maxage}, 
        location: {$in: locationQuery} })
    } 
    else if (user_profile_details.gender === "Male" && user_profile_details.interested_in[0] === "Women"){
      searchResults = await UserProfile.find({
        _id: { $nin: likedBlockedBlockedBy},
        gender: 'Female',
        interested_in: 'Men', 
        age: {$gte: minage, $lte: maxage}, 
        location: {$in: locationQuery} })
    }
    else if (user_profile_details.gender === "Female" && user_profile_details.interested_in[0] === "Women"){
      searchResults = await UserProfile.find({
        _id: { $ne: user_profile_details._id, $nin: likedBlockedBlockedBy},
        gender: 'Female', 
        interested_in: 'Women', 
        age: {$gte: minage, $lte: maxage}, 
        location: {$in: locationQuery} })
    } 
    else if (user_profile_details.gender === "Female" && user_profile_details.interested_in[0] === "Men"){
      searchResults = await UserProfile.find({
        _id: { $nin: likedBlockedBlockedBy},
        gender: 'Male', 
        interested_in: 'Women', 
        age: {$gte: minage, $lte: maxage}, 
        location: {$in: locationQuery} })
    }     
 
    res.render('profiles/filtered', {title:"Filtered Profiles", searchResults: searchResults})
  },
   Logout: function (req, res) {
    req.session.user_id = null;
    if (req.session.user_id === null) {
      res.redirect("/login");
    }
  },

};

module.exports = HomeController;
