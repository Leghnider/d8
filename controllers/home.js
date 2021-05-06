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
    }
  };


module.exports = HomeController;
