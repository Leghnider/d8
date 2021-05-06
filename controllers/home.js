var User = require('../models/userAccount')
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
      res.status(201).redirect('/');
    });
   },
   Login: function (req, res) {
    res.render("home/login", { title: "Log In" });
   },
   Authenticate: async function(req, res){
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      res.redirect('/login');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if(validPassword){
      req.session.user_id = user._id;
      res.redirect('/home');
    } 
    else{
      res.redirect('/login');
    }
  },

   Logout: function (req, res) {
    req.session.user_id = null;
    if (res.session.user_id === null) {
      res.redirect("/login");
    }
  },
  Dashboard: function(req, res) {
    User.find(function(err, users) {
      if (err) { throw err; }

      res.render('home/dashboard', { users: users });
    });
  }
};

module.exports = HomeController;
