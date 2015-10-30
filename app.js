var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var serveIndex    = require('serve-index')
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');

var routes        = require('./routes/index');
var users         = require('./routes/users');
var nhks           = require('./routes/nhks');

var app           = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('appName', 'NodeJS Express Site');

app.use(express.static(__dirname + '/public'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
//Display folder
app.use('/files', serveIndex('public', {'icons' : true} ));
//for share file. Direct display in brower
app.use('/files', express.static('public'));

app.use('/', routes);
app.use('/users', users);
//test redirect for typo error:)
app.get('/user', function(req, res) {
  res.redirect('users')
});

app.get('/nhk', nhks);
app.get('/tv', function(req, res) {
  res.redirect('nhk');
});

// app.use(function(req, res, next) {
//   console.log("Request at: %s %s - %s", new Date().toISOString().replace(/T/,  ' '), req.method, req.ulr);
//   return next();
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// catch 500 error handle
app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('Something broken!');
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(8800, function() {
  console.log("App listen in port 8800");
  console.log("__dirname", __dirname);
});

module.exports = app;
