var express = require('express');
var router = express.Router();

// there will need to be a controllers file in the controllers 

var UserController = require('../controllers/user');

/*
router.get('/user/:id', UserController.UserProfile);
router.get('/user/:id/edit', UserController.EditProfile);
*/

// router.get('/user/matches', UserController.EditProfile);


module.exports = router;