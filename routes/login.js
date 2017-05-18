var express = require('express');
var router = express.Router();
var verify = require('../model/verify.model');
var user = require('../model/user.model');
/* GET users listing. */
router.get('/login', function(req, res, next) {
	console.log(req.session.user,666);
 	res.render('login', {title: '登陆后台'});
});
router.get('/loginadmin', function(req, res, next) {
	console.log(req.session.user,666);
 	res.render('loginadmin', {title: '登陆管理员后台'});
});

router.post('/loginadmin', function(req, res, next) {
	if(req.body.phone=='admin'&&req.body.password=="admin"){
		var user ={
		  username: 'admin',
		  phone: '18813972184',
		  type: '5',
		};
		req.session.user = user;
		res.json('success');
	}else{
		res.json();
	}
});
// 添加验证码
router.post('/add', function(req, res, next) {
  	verify.add(req.body,function(){
  		res.json("success");
  	});
});
// 通过手机号码和验证码和状态1
router.post('/login',function(req,res,next){
	verify.findByVerifyPhone(req.body,function(err,data){
		// session 设置
		
		// 设置验证码为已使用;
		if(data!=null){
			data.state =2;
			verify.editdata(data,function(err,mydata){
				console.log('验证码已经使用')
			});
			user.getUserByPhone(req.body.phone,function(err,data){
				req.session.user = data;
				res.json(data);
			})
		}else{
			res.json(data);
		}
		
	});
});
// 通过手机号码和验证码和状态1
router.get('/loginout',function(req,res,next){
	if(req.session.user=='admin'){
		req.session.user = null;  
		res.redirect('/login/loginadmin');  
	}else{
		req.session.user = null;  
		res.redirect('/login/login');
	}
	
    
});
router.post('/phoneExist', function(req, res, next){
	user.getUserByPhone(req.body.phone,function(err,data){
		res.json(data);
	})
   
});
module.exports = router;