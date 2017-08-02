var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var portfolios = require('./routes/portfolios');

var app = express();

app.set('port', process.env.PORT || 3000);

var db = mongoose.createConnection("mongodb://localhost/counteroffer");
var portfolioSchema = require('./schema/Portfolio.js');
Portfolio = db.model('Portfolio', portfolioSchema);
app.set('Portfolio', Portfolio);

app.use(express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/portfolios', portfolios);

// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log('error! ' + err);
    return res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
/*
app.use(function(err, req, res, next) {
  return res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});
*/


module.exports = app;
