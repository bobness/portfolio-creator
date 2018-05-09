const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./js/routes');
const Portfolio = require('./js/portfolio');
const app = express();
const http = require('http');

const filePath = process.argv[2]; // node app.js [path]
const portfolio = new Portfolio(filePath);
app.set('portfolio', portfolio);

app.use(express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/portfolio', routes);

const server = http.createServer(app);
server.listen(process.env.PORT || 3000);
server.on('listening', () => {
	console.log('Listening on ', server.address());
});

// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
