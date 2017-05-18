var express = require('express');
var router = express.Router();
var user = require('../model/user.model');
var bank = require('../model/bank.model');
var type = require('../model/fault.model');
var Q = require('q')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/add',function (req, res, next) {
	bank.list(req,res,function(err,data){
		type.list(req,res,function(err,typedata){
			user.findByType(3,function(err,result){
			if(err){
				console.log(err);
			}
			res.render('useradd',{'jsondata':data,"parent":result,"typedata":typedata});   
		});
		})
		
	})
     
});

//add
router.post("/register",function(req,res){  
    user.add(req.body,function(err,data){
    	if(err){
    		console.log(err);
    	}
    	res.json(data);
    }); 
});
// list
router.post("/test",function(req,res,next){
	res.json("success");
})
router.get("/list",function(req,res,next){
	user.list(req,res,function(err,data){
		console.log(data);
		if(err){
			console.log(err)
		}
		user.countpage(err,function(err,num){
			var pagestart = parseInt(req.query.pagestart, 10) || 1;
			var pagesize = parseInt(req.query.pagesize, 10) || 10;
			var totalPages = Math.ceil(num/pagesize)
			res.render('userlist',{'jsondata':data,"totalPages":totalPages,"currentPage":pagestart,"all":num});
		});
			
	});	
});
function digui1(id,deferred){
    var deferred = deferred||Q.defer();
    user.getUserByPid(id,function(err,data){
        if (err) {
               deferred.reject(new Error(err));
        } else {
                deferred.resolve(data);
        }
    });
    return deferred.promise; // 这里返回一个承诺
}

router.get("/edit",function(req,res){
	user.edit(req.query.id,function(err,data){
		if(err){
			console.log(err)
		}
		user.findByType(1,function(err,result){
			if(err){
				console.log(err);
			}
			bank.list(req,res,function(err,bank_data){
				type.list(req,res,function(err,typedata){
					res.render('useredit',
						{
							'jsondata':data,
							'bjsondata':bank_data,
							"parent":result,
							"typedata":typedata
						});
				});
			});
			   
		});
	});	
});
router.post("/editdata",function(req,res,next){
	console.log(req.body);
	user.editdata(req.body,function(err,data){
		if(err){
			console.log(err)
			return next(err)
		}
		console.log(data);
		return res.end("success")
	});	
});
router.get("/del",function(req,res){
	user.delete(req.query.id,function(err,data){
		if(err){
			return console.log(err);
		}
		res.json(data);
	});	
});
// 58ae702a3b37fd2ba5e52b28 1
// 58aead8dcddc7539e5045784 3
router.get("/relation",function(req,res){
	digui("58be588f57176de7ed6e6f05",null).then(function(data){
			console.log(data)
			res.send("222222222222");
	})	
	// res.send("1111111");
		
});
var arr = new Array()
function digui(id,deferred){
    var deferred = deferred||Q.defer();
    user.getUserByPid(id,function(err,data){
    	// console.log(data)
    	// deferred.resolve(data);
        arr.push(data);
        if (err) {
               deferred.reject(new Error(err));
        } else {
            if(data.pid!="0"){
                digui(data.pid,deferred);
            }else{
                deferred.resolve(arr);
            }               
        }
    });
    return deferred.promise; // 这里返回一个承诺
}

module.exports = router;