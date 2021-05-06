var express = require("express");
var router = express.Router();

var HomeController = require("../controllers/home");

router.get("/", HomeController.Index);
router.get("/register", HomeController.Register);
router.post("/register", HomeController.CreateAccount);
router.get("/login", HomeController.Login);
router.post("/login", HomeController.Authenticate);
router.get("/dashboard", HomeController.Dashboard);
router.post("/logout", HomeController.Logout);
/*

router.get('/register-profile', HomeController.RegisterAccount); 
router.get('/home', HomeController.Dashboard);
*/

module.exports = router;
