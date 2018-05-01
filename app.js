var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var appRoutes = require('./routes/app');
var authRoutes = require('./routes/auth');
var dashboardRoutes = require('./routes/dashboard');
var relationshipRoutes = require('./routes/relationship');
var messageRoutes = require('./routes/message');
var dateRoutes = require('./routes/date');
var choreRoutes = require('./routes/chore');
var fightRoutes = require('./routes/fight');
var gratitudeRoutes = require('./routes/gratitude');

var app = express();

//Connect to MongoDB using Mongoose
mongoose.connect('mongodb://root:pass@ds231749.mlab.com:31749/relationship-manager', function(err, db) {
  if(err) {
    console.log("Couldn't connect to the database", err);
  } else {
    console.log("Successfully connected to db");
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/auth', authRoutes);
app.use('/relationship', relationshipRoutes);
app.use('/message', messageRoutes);
app.use('/date', dateRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/chore', choreRoutes);
app.use('/fight', fightRoutes);
app.use('/gratitude', gratitudeRoutes);
app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('index');
});

module.exports = app;
