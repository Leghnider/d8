var express = require("express");
var router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

var HomeController = require("../controllers/home");

router.get("/", HomeController.Index);
router.get("/register", HomeController.Register);
router.post("/register", HomeController.CreateAccount);
router.get("/register-profile", HomeController.RegisterProfile);
router.post(
  "/register-profile",
  upload.array("profileImage"),
  HomeController.CreateProfile
);
router.get(
  "/register-personality-questionnaire",
  HomeController.PersonalityPage
);
router.post(
  "/register-personality-questionnaire",
  HomeController.PersonalityQuestionnaire
);
router.get("/login", HomeController.Login);
router.post("/logout", HomeController.Logout);
router.post("/login", HomeController.Authenticate);
router.get("/home", HomeController.Dashboard);

router.get('/filtered', HomeController.Filter);

module.exports = router;
