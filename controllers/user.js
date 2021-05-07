var UserProfile = require('../models/userProfile');
var User = require('../models/userAccount');


var UserController = {
  UserProfile: async (req, res) => {
    if (!req.session.user_id) {
			res.redirect("/login");
    }
    const user = await User.findById(req.session.user_id);
    const userProfile = await UserProfile.find({ useraccount: { _id:  req.session.user_id }})
    res.render("user/index", { title: "Profiles", user: user, userProfile: userProfile });
  },
  EditProfile: async (req, res) => {
    if (!req.session.user_id){
      res.redirect('/login')
    }
    const user = await User.findById(req.session.user_id);
    res.render('user/edit', { title: 'Edit Profile', user: user});
  },



};

module.exports = UserController;