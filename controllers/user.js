var UserProfile = require("../models/userProfile");
var User = require("../models/userAccount");
const PersonalityQuestionnaire = require("../models/personalityQuestionnaire");

var UserController = {
  UserProfile: async (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/login");
    }
    const user = await User.findById(req.session.user_id);
    const userProfile = await UserProfile.findOne({
      useraccount: { _id: req.session.user_id },
    });
    const questionsAnswers = await PersonalityQuestionnaire.findOne({
      userprofile: { _id: userProfile._id },
    });

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

    userProfile.profileImages = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    await userProfile.save();

    res.status(201).redirect(`/user/${req.session.user_id}`);
  },

  LikeProfile: async function (req, res) {
    if (!req.session.user_id) {
      res.redirect("/login");
    }
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
      if (likeArray.includes(userInfo._id)) {
        isMatched = true;
      }
    }

    if (isMatched === true) {
      await UserProfile.findByIdAndUpdate(otherUser, {
        $addToSet: { matched: userInfo._id },
      });
      await UserProfile.findByIdAndUpdate(userInfo, {
        $addToSet: { matched: req.params.id },
      });
      req.flash("match", "You have a match");
    }
    return res.status(200).redirect("/home");
  },

  MatchProfile: async (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/login");
    } else {
      const user = await User.findById(req.session.user_id);
      const userProfile = await UserProfile.findOne({
        useraccount: { _id: req.session.user_id },
      });
			// get all their matches 
      const matchProfile = await UserProfile.find({
        _id: { $in: userProfile.matched },
      });
				
      res.render("user/match", {
        title: "Matches",
        userProfile: userProfile,
        user: user,
        matchProfile: matchProfile,
      });
    }
  },

  ChatPage: async function(req, res){
	if (!req.session.user_id) {
		res.redirect("/login");
	  }      
	  const userProfile = await UserProfile.findOne({
        useraccount: { _id: req.session.user_id },
      });

	  const matchProfile = await UserProfile.findOne({
		  _id: req.params.id
	  });

    console.log(matchProfile)

	  res.render('user/chat', {title: "Chat", userProfile: userProfile, matchProfile: matchProfile} )
  },
  
  UnmatchProfile: async function (req, res) {
    if (!req.session.user_id) {
      res.redirect("/login");
    }
    const userProfile = await UserProfile.findOne({
      useraccount: { _id: req.session.user_id },
    });

    await UserProfile.findOneAndUpdate(
      { _id: userProfile._id },
      { $pull: { matched: req.params.id, liked: req.params.id } }
    );
    await UserProfile.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { matched: userProfile._id, likes_received: userProfile._id } }
    );
    return res.status(200).redirect(`/user/${req.session.user_id}`);
  },
  BlockProfile: async function (req, res) {
    if (!req.session.user_id) {
      res.redirect("/login");
    }
    const userProfile = await UserProfile.findOne({
      useraccount: { _id: req.session.user_id },
    });

    await UserProfile.findOneAndUpdate(
      { _id: userProfile._id },
      {
        $pull: {
          matched: req.params.id,
          liked: req.params.id,
          likes_received: req.params.id,
        },
        $addToSet: { blocked: req.params.id },
      }
    );
    await UserProfile.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          matched: userProfile._id,
          liked: userProfile._id,
          likes_received: userProfile._id,
        },
        $addToSet: { blocked_by: userProfile._id },
      }
    );

    return res.status(200).redirect(`/user/${req.session.user_id}`);
  },
  DeleteProfile: async function (req, res) {
    if (!req.session.user_id) {
      res.redirect("/login");
    }
    const user = await User.findById(req.session.user_id);
    console.log(user);
    res.render("user/delete", {
      title: "Delete Profile",
      user: user,
    });
  },
  RemoveProfile: async function (req, res) {
    if (!req.session.user_id) {
      res.redirect("/login");
    }
    const user = await User.findById(req.session.user_id);
    const userProfile = await UserProfile.findOne({
      useraccount: { _id: req.session.user_id },
    });
    console.log(userProfile._id);

    await UserProfile.updateMany(
      {
        $or: [
          { liked: userProfile._id },
          { likes_received: userProfile._id },
          { matched: userProfile._id },
          { blocked: userProfile._id },
          { blocked_by: userProfile._id },
        ],
      },
      {
        $pull: {
          liked: userProfile._id,
          likes_received: userProfile._id,
          matched: userProfile._id,
          blocked: userProfile._id,
          blocked_by: userProfile._id,
        },
      }
    );

    await PersonalityQuestionnaire.findOneAndDelete({
      userprofile: { _id: userProfile._id },
    });
    await UserProfile.findByIdAndDelete(userProfile._id);
    await User.findByIdAndDelete(req.session.user_id);
    req.session.user_id = null;
    if (req.session.user_id === null) {
      req.flash("err", "You have sucessfully deleted your account");
      res.redirect("/register");
    }
  },
  AddPhoto: async function (req, res) {
    if (!req.session.user_id) {
      res.redirect("/login");
    }
    const userProfile = await UserProfile.findOne({
      useraccount: { _id: req.session.user_id },
    });
    const imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));

    userProfile.images.push(...imgs);
    await userProfile.save();

    res.redirect(`/user/${req.session.user_id}`);
  },
  DeletePhoto: async function (req, res) {
    if (!req.session.user_id) {
      res.redirect("/login");
    }
    const userProfile = await UserProfile.findOne({
      useraccount: { _id: req.session.user_id },
    });

    console.log(req.body.deletedImages);
    if (req.body.deletedImages) {
      await userProfile.updateOne({
        $pull: { images: { filename: { $in: req.body.deletedImages } } },
      });
    }
    res.redirect(`/user/${req.session.user_id}`);
  },
};

module.exports = UserController;
