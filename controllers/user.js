var UserProfile = require('../models/userProfile');
var User = require('../models/userAccount');
// var UserMatch = require('../models/userMatch')



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
		const userInfo = await UserProfile.findOne({
			useraccount: { _id: req.session.user_id },
		})
		const userProfile = await UserProfile.findByIdAndUpdate(userInfo._id, {
			// profilePicture: req.body.profilePic,
			bio: req.body.bio,
			username: req.body.username,
			location: req.body.location,
			age: req.body.age,
		});
		res.status(201).redirect(`/user/${req.session.user_id}`);
	},

	LikeProfile: async function (req, res) {
    UserProfile.findByIdAndUpdate(
			{ _id: req.params.id },
			{ $push: { liked: req.session.user_id.toString() } },
			function (err, like) {
				like.save((saveErr) => {
					if (saveErr) {
						throw saveErr;
					}
					return res.status(200).redirect("/home");
				});
			}
		);
	},
		
};
		
	


module.exports = UserController;