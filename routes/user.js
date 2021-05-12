var express = require('express');
var router = express.Router();

// there will need to be a controllers file in the controllers 

var UserController = require('../controllers/user');


router.get('/:id', UserController.UserProfile);
router.get('/:id/edit', UserController.EditProfile);
router.post('/:id/edit', UserController.UpdateProfile);
router.get('/:id/delete', UserController.DeleteProfile);
router.post('/:id/delete', UserController.RemoveProfile);

router.post('/liked/:id', UserController.LikeProfile);
router.get('/match/:id', UserController.MatchProfile);

router.post('/unmatch/:id', UserController.UnmatchProfile);
router.post('/block/:id', UserController.BlockProfile);

// router.post('/disliked/:id', UserController.DislikeProfile);

// router.get('/user/matches', UserController.EditProfile);


module.exports = router;