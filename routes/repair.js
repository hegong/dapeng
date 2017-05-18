var express = require('express');
var formidable = require('formidable');
var fs = require("fs");
var Q = require('q');
var router = express.Router();
var moment = require('moment');
var repair = require('../model/repair.model');
var bank = require('../model/bank.model');
var fault = require('../model/fault.model');
var user = require('../model/user.model');
/* GET repairs listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/add',function (req, res, next) {
	bank.list(req,res,function(err,data){
		fault.list(req,res,function(err,result){
			if(err){
				console.log(err);
			}
			res.render('repairadd',{'jsondata':data,"fault":result});
		})
	})
});

//add
router.post("/repairadd",function(req,res){ 
	user.findByBankAndScope(req.body.bank_id,req.body.type,function(err,data){
		console.log(data);
		if(!data){
			res.send('没有负责人请重现选择<a href="/repair/add">返回</a>');
			return
		}
		req['body']['charge'] = data;
		req['body']['byphone'] = data[0]['phone'];
		repair.add(req.body,function(err,data){
			 res.redirect("/repair/list");
		});
	})

   
});
// list
router.get("/list",function(req,res,next){
	var phone = req.session.user.phone;//session 技术人员18813972184 普通员13750528354
	user.getUserByPhone(phone,function(err,data){
		if(!data){
			res.render('repairlist',{'jsondata':data});
			res.end();
		}
		// 技术人员列表
		if(data.type=="2"){
			req['where'] = {'bank_id':data.bid,'type':{$in:data.scope}}
			repair.list(req,res,function(err,mydata){
				if(err){
					console.log(err)
				}
				 res.render('repairlist',{'jsondata':mydata,"type":data.type}); 
			});	
		// 普通用户列表
		}else{
			req['where'] = {'phone':phone}
			repair.list(req,res,function(err,mydata){
				if(err){
					console.log(err)
				}
				 res.render('repairlist',{'jsondata':mydata,"type":data.type}); 
			});	
		}
	})
});
router.get("/alllist",function(req,res,next){
	repair.alllist(req,res,function(err,mydata){
		if(err){
			console.log(err)
		}
		 res.render('repairlist',{'jsondata':mydata,"type":1}); 
	});		
});
router.get("/edit",function(req,res){
	console.log(req.query.id);
	repair.edit(req.query.id,function(err,data){
		if(err){
			console.log(err)
		}
		var temp = data;
		console.log(temp);
		res.render('repairedit',{'jsondata':temp,"flag":"true"}); 
	});	
});
router.post("/editdata",function(req,res,next){
	console.log(req.body,1);
	repair.editdata(req.body,function(err,data){
		if(err){
			console.log(err)
			return next(err)
		}
		res.json(data)
	});	
});
router.get("/del",function(req,res,next){
	console.log(req.query.id);
	repair.delete(req.query.id,function(err,data){
		if(err){
			console.log(err)
		}
		var temp = data;
		res.json(data);
	});	
});
router.post('/upload',function(req,res,next){
	var form = new formidable.IncomingForm();
	form.uploadDir = "public/images";//上传文件的保存路径
	form.keepExtensions = true;//保存扩展名
	form.maxFieldsSize = 20 * 1024;//上传文件的最大大小
	form.parse(req, function(err, fields, files) {
			var temp = files.picture.path.substring(14);
			console.log(temp);
			res.json("/images/"+temp);
	});
});

router.post('/getSendData',function(req,res){
	repair.getSendData(function(err,data){
		var bltime = new Date();
		console.log(bltime);
		arr =[];
		for (var i = 0;i<data.length; i++) {
			// 发送次数不为0
			if(data[i]["count"]!=0){
				var date1=new Date(data[i]['time']);    //开始时间
				var date2=new Date();    //结束时间
				var date3=date2.getTime()-date1.getTime(); //时间差秒
				var time = Math.floor(date3/(1000*60));//分钟
				var distime = 2*60*data[i]["count"];
				console.log("发送时隔"+distime)
				console.log("相隔时间"+time)
				if(time>distime){
					// 根据次数来判断改发送到第几个负责人
					if(data[i]["count"]<data[i]['charge'].length){
						var persons = data[i]["count"];
					}else{
						var persons = data[i]['charge'].length;
					}
					var charge = [];
					for(var j=0;j<persons;j++){
						charge.push(data[i]['charge'][j]);
					}
					data[i]['charge'] = charge;
					arr.push(data[i]);
				}
			}else{
				// 次数为0时，只需要发送一次技术人员，不用通知负责人
				data[i]['charge'] = data[i]['charge'][0];
				arr.push(data[i]);
			}
		}	
		res.send(arr);
	});
});


module.exports = router;