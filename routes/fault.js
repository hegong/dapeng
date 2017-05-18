var express = require('express');
var router = express.Router();
var fault = require('../model/fault.model');
/* GET faults listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/add',function (req, res, next) {
    res.render('faultadd');    
});

//add
router.post("/faultadd",function(req,res){  
    console.log(req.body);
    fault.add(req.body); // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("faultadd");
});
// list
router.get("/list",function(req,res,next){
	fault.list(req,res,function(err,data){
		if(err){
			console.log(err)
		}
		var temp = data;
		console.log(temp);
		res.render('faultlist',{'jsondata':temp});  
	});	
});

router.get("/edit",function(req,res){
	console.log(req.query.id);
	fault.edit(req.query.id,function(err,data){
		if(err){
			console.log(err)
		}
		var temp = data;
		console.log(temp);
		res.render('faultedit',{'jsondata':temp}); 
	});	
});
router.get("/editdata",function(req,res,next){
	fault.editdata(req.query,function(err,data){
		if(err){
			console.log(err)
		}
		res.end('success')
	});	
	res.end('success')
});
router.get("/del",function(req,res,next){
	console.log(req.query.id);
	fault.delete(req.query.id,function(err,data){
		if(err){
			console.log(err)
		}
		var temp = data;
		res.json(data);
	});	
});
module.exports = router;