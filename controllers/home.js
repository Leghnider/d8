var User = require("../models/userAccount");
var UserProfile = require("../models/userProfile");
var PersonalityProfile = require("../models/personalityQuestionnaire");
const bcrypt = require("bcrypt");
const UserAccount = require("../models/userAccount");

var HomeController = {
  Index: function (req, res) {
    res.render("home/index", { title: "d8" });
  },
  Register: function (req, res) {
    res.render("home/register", {
      messages: req.flash("err"),
      title: "Register",
    });
  },
  CreateAccount: async function (req, res) {
    const { firstName, lastName, age, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    const passwordValidator = /.*[0-9].*/

    var checkEmail = await UserAccount.findOne({ email });

    if (checkEmail) {
      req.flash('err', 'This email has already been registered.')
      return res.status(400).redirect('/register')
    }
    if ((emailValidator).test(email) === false) {
			req.flash('err', 'You must provide a valid email address')
      return res.status(400).redirect('/register');
		}
    if ((passwordValidator).test(password) === false) {
			req.flash('err', 'Your password must have a least one number')
      return res.status(400).redirect('/register');
		}

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
    res.render("home/register-profile", { messages: req.flash("err"), title: "Register Profile" });
  },
  CreateProfile: async function (req, res) {
    const user = await User.findById(req.session.user_id);
    const { username, bio, location, gender, interested_in } = req.body;

    var checkUsername = await UserProfile.findOne({ username });

    if (checkUsername) {
      req.flash('err', 'This username has already been taken. Please select a different username.')
      return res.status(400).redirect('/register-profile')
    };

    var userProfile = new UserProfile({
      username,
      bio,
      location,
      gender,
      age: user.age ,
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
      }
    );
  },

  PersonalityPage: function (req, res) {
    res.render("home/personality-questionnaire", {
      title: "Further Information",
    });
  },

  PersonalityQuestionnaire: async function (req, res) {
    const user = await User.findById(req.session.user_id);
    const userProfile = await UserProfile.findOne({
      useraccount: req.session.user_id,
    });

    console.log(userProfile._id);
    const { q1, q2, q3, q4, q5 } = req.body;

    var personalityProfile = new PersonalityProfile({
      userprofile: userProfile._id,
      q1,
      q2,
      q3,
      q4,
      q5,
    });
    await personalityProfile.save(function(err) {
      if(err) {
        throw err
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

    await res.render("home/dashboard", {
      title: "Home",
      userProfiles: searchResults,
      user: user,
    });
  },

  Filter: async(req, res) => {

    var minage = 18;
    var maxage = 100;

    if (req.query.minage !== "") {
      minage = Number(req.query.minage);
    }
    if (req.query.maxage !== "") {
      maxage = Number(req.query.maxage);
    }
    if (req.query.location === undefined) {
      var locationQuery = [
        "North London",
        "West London",
        "South London",
        "East London",
      ];
    } else {
      locationQuery = req.query.location;
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
 
    res.render('profiles/filtered', {title:"Filtered Profiles", searchResults: searchResults, user: user})
  },
  RandomLike: async function (req, res) {
    // this is from the dashboard - need to get the array of search results
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
    var randomLike = searchResults[Math.floor(Math.random()* searchResults.length)];


    await UserProfile.findByIdAndUpdate(
      randomLike._id,
      { $addToSet: { likes_received: user_profile_details._id.toString() } }
    );

    await UserProfile.findByIdAndUpdate(
      user_profile_details._id,
      { $addToSet: { liked: randomLike._id.toString() } }
    );
    
    var isMatched;
    var likeArray = randomLike.liked;

    for (var i = 0; i < likeArray.length; i++) {
			if (likeArray.includes(user_profile_details._id)){
				isMatched = true;
			}
		}

    if (isMatched === true) {
			await UserProfile.findByIdAndUpdate(randomLike._id, {
				$addToSet: {matched: user_profile_details._id}
			})
			await UserProfile.findByIdAndUpdate(user_profile_details._id, {
				$addToSet: {matched: randomLike._id}
			})
		};

    res.redirect("/home");
  },
  Logout: function (req, res) {
    req.session.user_id = null;
    if (req.session.user_id === null) {
      res.redirect("/login");
    }
  },

};

module.exports = HomeController;
