var express = require('express');
var router = express.Router();
var bank = require('../model/bank.model');
/* GET banks listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/add',function (req, res, next) {
	bank.findByBankPid(function(err,data){
		console.log(data);
		 res.render('bankadd',{'jsondata':data}); 
	})
      
});

//add
router.post("/bankadd",function(req,res){  
    console.log(req.body);
    bank.add(req.body); // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.json('success');
});
// list
router.get("/list",function(req,res,next){
	bank.list(req,res,function(err,data){
		if(err){
			console.log(err)
		}
		var temp = data;
		console.log(temp);
		res.render('banklist',{'jsondata':temp});  
	});	
});

router.get("/edit",function(req,res){
	console.log(req.query.id);
	bank.findByBankPid(function(err,mydata){
		bank.edit(req.query.id,function(err,data){
			if(err){
				console.log(err)
			}
			res.render('bankedit',{'jsondata':data,"banklist":mydata}); 
		});	
	});
	
});
router.post("/editdata",function(req,res,next){
	console.log(req.body);
	bank.editdata(req.body,function(err,data){
		if(err){
			console.log(err)
			return next(err)
		}
		return res.end("success")
	});	
	res.end("success")

});
router.get("/del",function(req,res,next){
	console.log(req.query.id);
	bank.delete(req.query.id,function(err,data){
		if(err){
			console.log(err)
		}
		var temp = data;
		res.json(data);
	});	
});
module.exports = router;