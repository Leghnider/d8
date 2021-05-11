var UserProfile = require("../models/userProfile");
var User = require("../models/userAccount");
const { socketapi } = require("../socketapi");
const io = require('socket.io')

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

    var isMatched;
    var likeArray = otherUser.liked;

    for (var i = 0; i < likeArray.length; i++) {
      if (likeArray.includes(userInfo._id)) {
        isMatched = true;
      }
    }

    if (isMatched === true) {
      await UserProfile.findByIdAndUpdate(otherUser, {
        $push: { matched: userInfo._id },
      });
      await UserProfile.findByIdAndUpdate(userInfo, {
        $push: { matched: req.params.id },
      });
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

  MatchProfile: async (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/login");
    } else {
      const user = await User.findById(req.session.user_id);
      const userProfile = await UserProfile.find({
        useraccount: { _id: req.session.user_id },
      }).populate("matched");
      const matchProfile = await UserProfile.find({
        _id: { $all: userProfile.matched },
      });
	  console.log(userProfile)
	  console.log(matchProfile)
      res.render("user/match", {
        title: "Profiles",
        userProfile: userProfile,
        user: user,
        matchProfile: matchProfile,
      });
    }
  },
  ChatPage: async (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/login");
    }
      const userProfile = await UserProfile.findOne({
        useraccount: { _id: req.session.user_id },
      });
      const roomId = `room-${userProfile._id}-${req.params.id}`
      
      var socket = io();

      socket.on('create', function (room_id) {
        socket.join(room_id);
      });
   
      
      res.render('user/chat', {userProfile: userProfile, roomId: roomId} )
    
    }

  }


module.exports = UserController;
