var express     = require('express');
var router      = express.Router();

/*router.use(function timeLog(req, res, next) {
  console.log('Request at: ', new Date().toISOString().replace(/T/, ' '));
  console.log(req.method);
  console.log(req.originalUrl);
  next();
})*/
router.use(function(req, res, next) {
  console.log("2. Request at: %s %s - %s", new Date().toISOString().replace(/T/,  ' '), req.method, req.originalUrl);
  return next();
});
/* Handler function */
 var fn1 = function(req, res, next) {
   console.log('CB0');
   next();
 }
 
 var fn2 = function(req, res, next) {
   console.log('CB1');
   next();
 }
 
 var fb3 = function(req, res) {
   res.send('Hello! This is response for a User/* request');
 }

var fs = require('fs'), path = require('path');


/* GET users listing. */
router.get('/', function(req, res, next) {
  fs.readFile(path.join(__dirname, '../public/images/jquery.png'), function(err, data) {
    if(err) {
      console.log(err);
       next();
      }
    res.render('users/default', {title : 'User Home', src : data.toString('base64')});
  })
});

router.get('/a', function(req, res, next) {
  console.log(req.param('long'));
  res.send('Respond with a resource for A request');
});

router.get('/b', [fn1, fn2, fb3]);

router.get('/c', [fn1, fn2], function(req, res, next) {
  console.log('Combination of array of func and independent func');
  next();
}, function(req, res ) {
  res.send('Hello world from User');
});

router.get('/boi', function(req, res) {
  res.redirect('a');  
});

router.get('/dl', function(req, res) {
  res.download('./public/images/jquery.png', 'jquery.png');
});

router.post('/login', function(req, res) {
  // console.log('Username: ',req.param('user'));
  // console.log('Password: ', req.param('password'));
  var data = req.body;
  console.log(data);
  if(data.user == data.password) {
    res.send("Login failed. Please try again!");
  }else 
  {
    res.status(200);
    /*res.set('Content-type', 'text/html');
    res.send('<html><body>'+
              '<h1>Hello ' + data.user + '</h1>'+
              '</body> </html>'
              );*/
    res.render('users/userslist', {name : data.users.toString()});
  }
  /*res.send("Login successful. Hello %s", data.user);
  If success or not condition here
  res.status(200).send("Login successful. Hello %s", data.user);*/
});



module.exports = router;
