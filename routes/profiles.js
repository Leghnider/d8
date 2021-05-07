var express = require('express');
var router = express.Router();

// there will need to be a controllers file in the controllers 

var ProfilesController = require('../controllers/profiles');

router.get('/:id', ProfilesController.ShowProfile);

module.exports = router;