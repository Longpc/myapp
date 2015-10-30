var express 	= require('express');
var router 		= express.Router();
var http 		= require('http');

var options = {
	host 	: 'api.nhk.or.jp',
	port 	: 80,
	path 	: '/v1/pg/list/130/g1/2015-10-28.json?key=zsGY6yIC4W4AA8Sw82l6G7mHPiwdDGGr',
	method 	: 'GET'
};

router.use(function(req, res, next) {
	console.log("Request to NHK at: %s", new Date().toISOString().replace(/T/,  ' '));
	return next();
});

router.get('/', function(req, res, next) {
	res.send("Well come to NHK programs list");
});

router.get('/list', function(req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	var request = http.request(options, function(response) {
		response.on('data', function(data) {
			console.log(data);
			res.end(data);
		})
		request.end();
		request.on('error', function(e) {
			console.log(e);
		});
	});
});

module.exports = router;