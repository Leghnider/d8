const passport = require('passport')
const UserProfile = require('./models/userProfile')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "XXX",
    clientSecret: "XXX",
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    UserProfile.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

