var User = require('../models/userAccount');
var UserProfile = require('../models/userProfile');
const bcrypt = require('bcrypt');

var HomeController = {
  Index: function(req, res) {
    res.render('home/index', { title: 'd8' });
  },
  Register: function (req, res) {
		res.render("home/register", {title: 'Register'});
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

      await user.save(function(err){
        if (err) { 
          throw err 
        }
      // redirect this to the next registration page
      res.status(201).redirect('/register-profile');
    });
   },
   RegisterProfile: function (req, res) {
    res.render("home/register-profile", {title: 'Register Profile'});
   },
   CreateProfile: async function (req, res) {
    console.log(req.body)
    const { username, bio, location, gender, age, interested_in } = req.body;

    //need to add the persisting information of the user and picture
    var userProfile = new UserProfile({
      username,
      bio,
      location, 
      gender, 
      age, 
      interested_in,
    });

    await userProfile.save(function(err){
      if (err) { throw err }; 
      res.status(201).redirect('/home');
    });
   },
   Login: function (req, res) {
    res.render("home/login", { title: "Log In" });
   },
   Dashboard: function(req, res){
    res.render("home/dashboard", { title: "Home" });
   },
   Logout: function (req, res) {
    req.session.user_id = null;
    if (res.session.user_id === null) {
      res.redirect("/login");
    }
  },
};

module.exports = HomeController;
