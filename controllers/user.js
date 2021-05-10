var UserProfile = require("../models/userProfile");
var User = require("../models/userAccount");
// const UserAccount = require("../models/userAccount");
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
		const userInfo = await UserProfile.findOne({
			useraccount: { _id: req.session.user_id },
		});

		res.render("user/edit", {
			title: "Edit Profile",
			user: user,
			userInfo: userInfo,
		});
	},

	UpdateProfile: async (req, res) => {
		if (!req.session.user_id) {
			res.redirect("/login");
		}
		const userInfo = await UserProfile.findOne({
			useraccount: { _id: req.session.user_id },
		});
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
		const userInfo = await UserProfile.findOne({
			useraccount: { _id: req.session.user_id },
		});
		await UserProfile.findByIdAndUpdate(
			{ _id: req.params.id },
			{ $addToSet: { likes_received: userInfo._id.toString() } }
		);

		await UserProfile.findByIdAndUpdate(userInfo, {
			$addToSet: { liked: req.params.id.toString() },
		});
		console.log(req.session.user_id);

		const otherUser = await UserProfile.findById({
			_id: req.params.id,
		});

		console.log(otherUser);
		console.log(otherUser.liked);
		var isMatched;

		for (var i = 0; i < otherUser.liked.length; i++) {
			if (otherUser.liked[userInfo._id]) {
				isMatched = true;
			}
		}
		if (isMatched === true) {
			otherUser.update({ matched: userInfo._id });
			userInfo.update({ matched: req.params.id });
		}

		return res.status(200).redirect("/home");
	},
	//   DislikeProfile: async function (req, res) {
	//     await UserProfile.findByIdAndUpdate(
	//       { _id: req.params.id },
	//       { $pull: { likes_received: req.session.user_id.toString() } }
	//     );

	//     const userInfo = await UserProfile.findOne({
	//       useraccount: { _id: req.session.user_id },
	//     });
	//     const liked = await UserProfile.findByIdAndUpdate(userInfo, {
	//       $pull: { liked: req.params.id.toString() },
	//     });
	//     console.log(req.session.user_id);
	//     console.log(liked);
	//     // if (saveErr) {
	//     // 	throw saveErr;}
	//     return res.status(200).redirect("/home");
	//   },
};

module.exports = UserController;
