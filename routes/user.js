var express = require('express');
var router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// there will need to be a controllers file in the controllers 

var UserController = require('../controllers/user');


router.get('/:id', UserController.UserProfile);
router.get('/:id/edit', UserController.EditProfile);
router.post('/:id/edit', upload.array("profileImage"), UserController.UpdateProfile);
router.get('/:id/delete', UserController.DeleteProfile);
router.post('/:id/delete', UserController.RemoveProfile);

router.post('/:id/addPhoto', upload.array("image"), UserController.AddPhoto);
router.post('/:id/deletePhotos', UserController.DeletePhoto);


router.post('/liked/:id', UserController.LikeProfile);
router.get('/match/:id', UserController.MatchProfile);
router.get('/:id/chat', UserController.ChatPage);

router.post('/unmatch/:id', UserController.UnmatchProfile);
router.post('/block/:id', UserController.BlockProfile);

// router.post('/disliked/:id', UserController.DislikeProfile);

// router.get('/user/matches', UserController.EditProfile);


module.exports = router;