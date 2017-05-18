var express = require('express');
var user = require('../model/user.model')
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
		console.log();
		// var ses = req.session.user;
		var ses = req.session.user;
		console.log(ses);
		res.render('index', {username: ses});

  		
});
router.get('/welcome.html', function(req, res, next) {
		var ses = req.session.user;
		console.log(ses);
  		res.render('welcome', {username:1 });
});

module.exports = router;
