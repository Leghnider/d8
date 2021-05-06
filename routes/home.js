var express = require("express");
var router = express.Router();

var HomeController = require("../controllers/home");

router.get('/', HomeController.Index);
router.get('/register', HomeController.Register);
router.post('/register', HomeController.CreateAccount);
router.get('/register-profile', HomeController.RegisterProfile);
router.post('/register-profile', HomeController.CreateProfile);
router.get('/login', HomeController.Login);
router.get('/home', HomeController.Dashboard);

/*
router.get('/logout', HomeController.Logout);
router.get('/register-profile', HomeController.RegisterAccount); 

*/


module.exports = router;
