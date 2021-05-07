var express = require('express');
var router = express.Router();

// there will need to be a controllers file in the controllers 

var UserController = require('../controllers/user');


router.get('/:id', UserController.UserProfile);
router.get('/:id/edit', UserController.EditProfile);
 router.post('/:id/edit', UserController.UpdateProfile);

// router.get('/user/matches', UserController.EditProfile);


module.exports = router;