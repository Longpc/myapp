var express 	= require('express');
var router 		= express.Router();
var http 		= require('http');
var request 	= require('request');
var moment 		= require('moment');
var pagination  = require('paginate');

var APIKEY 		= "zsGY6yIC4W4AA8Sw82l6G7mHPiwdDGGr";

var today = moment().format().substr(0,10);
var tomorow = moment().add(1, 'days').format().substr(0,10);
var params ={
	service : [
		{code : "g1", name : "ＮＨＫ総合１"},
		{code : "e1", name : "ＮＨＫＥテレ１"},
		{code : "e4", name : "ＮＨＫワンセグ２"},
		{code : "s1", name : "ＮＨＫＢＳ１"},
		{code : "s3", name : "ＮＨＫＢＳプレミアム"},
		{code : "r1", name : "ＮＨＫラジオ第1"},
		{code : "r2", name : "ＮＨＫラジオ第2"},
		{code : "r3", name : "ＮＨＫＦＭ"}
	],
	area :[
		{code : 130 , name : "東京"},
		{code : 120 , name : "千葉"},
		{code : 140 , name : "横浜"},
		{code : 220 , name : "静岡"},
		{code : 260 , name : "京都"},
		{code : 270 , name : "大阪"}
	],
	date :[today, tomorow],
	genre : [
		{code : "9999" , name : "全部"},
		{code : "0000" , name : "ニュース／報道(定時・総合)"},
		{code : "0100" , name : "スポーツ(スポーツニュース)"},
		{code : "0205" , name : "情報／ワイドショー(グルメ・料理)"},
		{code : "0300" , name : "ドラマ(国内ドラマ)"},
		{code : "0409" , name : "音楽(童謡・キッズ)"},
		{code : "0502" , name : "バラエティ(トークバラエティ)"},
		{code : "0600" , name : "映画(洋画)"},
		{code : "0700" , name : "アニメ／特撮(国内アニメ)"},
		{code : "0800" , name : "ドキュメンタリー／教養(社会・時事)"},
		{code : "0903" , name : "劇場／公演(落語・演芸)"},
		{code : "1000" , name : "趣味／教育(旅・釣り・アウトドア)"},
		{code : "1100" , name : "福祉(高齢者)"}
	]
};

var pagination = {
	perPage : 10,
	currentPage : 1	,
	pageNum  : 0,
	fieldNum : 0
};

var saveData;
var selectedParam;
/*
Request funtion
 */
function callAPI(area, service, genre, date, res) {
	selectedParam = {
						service : service,
						area : area,
						date : date,
						genre : genre
					};
	var apiAddress = "http://api.nhk.or.jp/v1/pg/";
	if(genre == '9999'){
		apiAddress += "list/"+area+"/"+service+"/"+date+".json?key="+APIKEY;
	}
	else {
		apiAddress += "genre/"+area+"/"+service+"/"+genre+"/"+date+".json?key="+APIKEY;
	}
	//console.log(apiAddress);
	request(apiAddress, function(err, resp, body) {
		if(!err && resp.statusCode == 200) {
			//console.log('Respond data;');
			var data = JSON.parse(body);
			//console.log(data);
			if(!data.list) {
				res.render('list', {param : params, selected : selectedParam});
				return console.log("data null");
			}
			saveData = data.list[service];
			pagination.fieldNum = saveData.length;		
			pagination.pageNum = Math.ceil(saveData.length	/ pagination.perPage);
			pagination.currentPage = 1;
			pagination.from = 1;
			pagination.des = 10;	
			var maxLeng = 10;
			if (saveData.length < maxLeng)  {
				maxLeng = saveData.length;
				pagination.des = maxLeng;	
			}
			var newData = saveData.slice(0,maxLeng);
			res.render('list', {
				data : newData,
				param : params,
				selected : selectedParam,
				paging : pagination
			});
		}
	});
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', function(req, res) {
	callAPI(130,"g1","9999",today, res);	
});

router.get('/list/:pageId', function(req, res) {
	//res.send("pageNum is: "+ req.params.pageId);
	var pageId = req.params.pageId;
	if(pageId > pagination.pageNum || pageId <= 0) {
		res.redirect("/list");
		return;
	}
	var beginField = (pageId-1)*10;
	var des = (pageId == pagination.pageNum)? pagination.fieldNum : pageId*10;
	if(saveData && pageId > 0 && pageId <= pagination.pageNum) {
		pagination.currentPage = pageId;
		pagination.from = beginField + 1;
		pagination.des = des;
		var newData = saveData.slice(beginField, des);
		//console.log(des);
		//console.log(newData.length);
		res.render('list', {
				data : newData,
				param : params,
				selected : selectedParam,
				paging : pagination
			});
	}else {
		res.send("Something wrong!");
	}
	
});
router.post('/list', function(req, res) {
	console.log(req.body);
	if(req.body.service && req.body.area && req.body.date) {
		callAPI(req.body.area, req.body.service, req.body.genre, req.body.date, res);
	}else 
	{
		res.render('list', {param : params});
	}
});
router.get("/search", function(req, res) {
	res.redirect("/list");
})
router.post('/search', function(req, res) {
	console.log(req.body);
	if(!saveData || !req.body) {
		res.send("Wrong param!");
		return;
	}
	var key = req.body.key;
	var newData = [];
	saveData.forEach(function(item) {
		if(item.title.indexOf(key) > -1 || item.subtitle.indexOf(key) > -1) {
			newData.push(item);
		}
	});
	saveData = newData;
	pagination.fieldNum = saveData.length;		
	pagination.pageNum = Math.ceil(saveData.length	/ pagination.perPage);
	pagination.currentPage = 1;
	pagination.from = 1;
	pagination.des = 10;	
	var maxLeng = 10;
	if (saveData.length < maxLeng)  {
		maxLeng = saveData.length;
		pagination.des = maxLeng;
	}
	var newData1 = saveData.slice(0,maxLeng);
	res.render('list', {
		data : newData1,
		param : params,
		selected : selectedParam,
		paging : pagination
	});

	
});
router.use(function(req, res, next) {
  console.log("1. Request at: %s %s - %s", new Date().toISOString().replace(/T/,  ' '), req.method, req.originalUrl);
  return next();
});

module.exports = router;
