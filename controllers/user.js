var UserProfile = require("../models/userProfile");
var User = require("../models/userAccount");
const PersonalityQuestionnaire = require('../models/personalityQuestionnaire')

var UserController = {
	UserProfile: async (req, res) => {
		if (!req.session.user_id) {
			res.redirect("/login");
		}
		const user = await User.findById(req.session.user_id);
		const userProfile = await UserProfile.findOne({
			useraccount: { _id: req.session.user_id },
		});
		const questionsAnswers = await PersonalityQuestionnaire.findOne({userprofile: {_id: userProfile._id}})

		res.render("user/index", {
			title: "Profiles",
			user: user,
			userProfile: userProfile,
			questionsAnswers: questionsAnswers,
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

		var isMatched;
		var likeArray = otherUser.liked;

		for (var i = 0; i < likeArray.length; i++) {
			if (likeArray.includes(userInfo._id)){
				isMatched = true;
			}
		}

		if (isMatched === true) {
			await UserProfile.findByIdAndUpdate(otherUser, {
				$push: {matched: userInfo._id}
			})
			await UserProfile.findByIdAndUpdate(userInfo, {
				$push: {matched: req.params.id}
			})
		}
		return res.status(200).redirect("/home");
	},

	MatchProfile: async (req, res) => {
		// if (!req.session.user_id) {
		// 	res.redirect("/login");
		// } else {
		const user = await User.findById(req.session.user_id);
		const userProfile = await UserProfile.findOne({
		useraccount: { _id: req.session.user_id }})
		const matchProfile = await UserProfile.find({_id:  {$all: userProfile.matched}})

		res.render("user/match", {
			// title: "Profiles",
			userProfile: userProfile,
      // user: user,
			matchProfile: matchProfile
		}
	);
		},
	UnmatchProfile: async function(req, res){
		const userProfile = await UserProfile.findOne({
			useraccount: { _id: req.session.user_id }
		})

		await UserProfile.findOneAndUpdate(
			{ _id: userProfile._id }, 
			{$pull: {matched: req.params.id, liked: req.params.id} 
			}
		)
		await UserProfile.findOneAndUpdate(
			{ _id: req.params.id }, 
			{$pull: {matched: userProfile._id , likes_received: userProfile._id } 
			}
		)
		return res.status(200).redirect(`/user/${req.session.user_id}`);
	},
	BlockProfile: async function(req, res){
		const userProfile = await UserProfile.findOne({
			useraccount: { _id: req.session.user_id }
		})

		await UserProfile.findOneAndUpdate(
			{ _id: userProfile._id }, 
			{$pull: {matched: req.params.id, liked: req.params.id, likes_received: req.params.id}, $addToSet: {blocked: req.params.id} 
			}
		)
		await UserProfile.findOneAndUpdate(
			{ _id: req.params.id }, 
			{$pull: {matched: userProfile._id, liked: userProfile._id, likes_received: userProfile._id }, $addToSet: {blocked_by: userProfile._id}  
			}
		)
		
		return res.status(200).redirect(`/user/${req.session.user_id}`);
	}
	
};



module.exports = UserController;
