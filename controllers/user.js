var UserProfile = require('../models/userProfile');
var User = require('../models/userAccount');


var UserController = {
	UserProfile: async (req, res) => {
		if (!req.session.user_id) {
			res.redirect("/login");
		}
		const user = await User.findById(req.session.user_id);
		const userProfile = await UserProfile.find({
			useraccount: { _id: req.session.user_id },
		});
		res.render("user/index", {
			title: "Profiles",
			user: user,
			userProfile: userProfile,
		});
	},
	EditProfile: async (req, res) => {
		if (!req.session.user_id) {
			res.redirect("/login");
		}
		const user = await User.findById(req.session.user_id);
		res.render("user/edit", { title: "Edit Profile", user: user });
	},

	UpdateProfile: async (req, res) => {
		if (!req.session.user_id) {
			res.redirect("/login");
		}
    console.log(req.body)
		const userProfile = await UserProfile.findByIdAndUpdate(
			{ useraccount: { _id:  req.session.user_id }},
			{
				// profilePicture: req.body.profilePic,
				bio: req.body.bio,
				username: req.body.username,
				location: req.body.location,
				age: req.body.age
			}
		);
		res.status(201).redirect(`/user/${userProfile._id}`);
	},
};
		
	


module.exports = UserController;