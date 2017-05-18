var express = require('express');
var router = express.Router();
var verify = require('../model/verify.model');
/* GET verifys listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// 待发送验证码列表
router.post("/list",function(req,res,next){
	verify.list(req,res,function(err,data){
		if(err){
			console.log(err)
		}
		res.send(data);
	});	
});
// 修改验证码状态
router.post("/editdata",function(req,res,next){
	console.log(req.body);
	verify.editdata(req.body,function(err,data){
		if(err){
			console.log(err)
			return next(err)
		}
		return res.end("success");
	});	
	res.end("success");
});
router.get('/add',function (req, res, next) {
	verify.findByVerifyPid(function(err,data){
		console.log(data);
		 res.render('verifyadd',{'jsondata':data}); 
	})
      
});

//add
router.post("/verifyadd",function(req,res){  
    console.log(req.body);
    verify.add(req.body); // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.json('success');
});
// list 


router.post("/getVerify111",function(req,res){
	console.log(req.query.id);
	verify.findByVerifyPid(function(err,mydata){
		verify.edit(req.body.id,function(err,data){
			if(err){
				console.log(err)
			}
			res.render('verifyedit',{'jsondata':data,"verifylist":mydata}); 
		});	
	});
	
});

router.get("/del",function(req,res,next){
	console.log(req.query.id);
	verify.delete(req.query.id,function(err,data){
		if(err){
			console.log(err)
		}
		var temp = data;
		res.json(data);
	});	
});
module.exports = router;