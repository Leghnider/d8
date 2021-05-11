if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const _ = require("lodash");


var homeRouter = require('./routes/home');
var userRouter = require('./routes/user');
var profilesRouter = require('./routes/profiles');

var app = express();
var hbs = require('hbs');

hbs.registerPartials(__dirname + '/views/partials', function (err) {});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerHelper('countlikes_received', (arrayOfIds) => {
  return _.uniq(arrayOfIds).length;
})

//sessions
app.use(
	session({
		secret: "keyboard cat",
}),
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// route setup
// do we need a homeRouter? - Use this route for all the login, logout, registration information, will include the 'home' (dashboard) page
app.use('/', homeRouter);
// routes for the user's information 
app.use('/user', userRouter); /* :id, :id/edit, :matches */
//routes for the profiles to view 
app.use('/profiles', profilesRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
