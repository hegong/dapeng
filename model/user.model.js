var mongoose = require('mongoose');
var Q = require('q');
var userSchema = new mongoose.Schema({
	username:String,
	phone:String,
	type:String,//1普通员工，2技术人员，3，负责人
	bid:String,  //存入银行的名字
	pid:String,
    pname:String,
    // pid: { Schema.ObjectId, ref:'userSchema'},
    scope:Array
});

var user  = mongoose.model('user',userSchema);

exports.add = function(data,next) {
    console.log(data);
    data['scope'] = data['scope[]'];
    var myuser = new user(data);
    myuser.save(function(err,mydata){
        if(err){
            console.log("FATAL:"+err);
            next(err);
        }else{
            return next(null,mydata);
        }
    });
}

exports.list = function(req,res,next){
	// 对于这两个参数，还需要思考，如果用户传入负数怎么办
	var pagesize = parseInt(req.query.pagesize, 10) || 10;
	var pagestart = parseInt(req.query.pagestart, 10) || 1;
    user
	.find(
    // {pid: {$ne:'0'}}
    )
    // .populate({
    //     'path':'pid',
    //     'model': user,
    //     'select': '_id username phone'
    // })
	// 搜索时，跳过的条数
	.skip( (pagestart - 1) * pagesize )
	// 获取的结果集条数
	.limit( pagesize)
	.exec(function(err, docs){
	    if(err) return next(err);
        return next(null,docs);
        // user
        // .find({
        //     pid: {$eq:'0'}
        // })
        // .exec(function(err, docs1){
        //   if(err) return next(err);
          // return next(null,docs.concat(docs1));
        // });
	});
    
}
exports.findByType = function(err,next){
	var whereStr = {type:'3'};
	user.find(whereStr,function(err,res){
		if(err){
			console.log("Error"+err);
		}
		return next(null,res);
	});
}
// 有上级的
exports.countpage =function(err,next){
    user.count(function(err,count){
        return next(null,count)
    })
}
exports.delete = function(id,next) {
    user.findByIdAndRemove(id,function (err, user) {
         if(err){
             console.log(err);
             return;
         }
         return next(null,user);
     });
}

exports.edit = function(id,next) {
    user.findById(id,function (err, data) {         
         if(err){
             console.log(err);
             return;
         }
         return next(null,data);
     });
}
exports.editdata = function(data,next) {
	console.log(data['scope[]']);
    data['scope'] = data['scope[]'];
    user.findByIdAndUpdate(
    	{_id:data.id},
    	{$set:data},
    	function(err,myuser){
    		if(err){
             console.log(err);
             return;
         	}
      		return next(null,myuser); //MDragon
   		 });
}
exports.getUserByPhone = function(phone,next){
    user.findOne({"phone":phone},function(err,res){
        return next(null,res);
    })
}
// 电话和类型2 取出技术人员的银行和故障类型
exports.getUserByPhoneAndType = function(phone,next){
    user.findOne({"phone":phone,type:2},function(err,res){
        return next(null,res);
    })
}
exports.getUserByPid = function(id,next){
	user.findById({_id:id},function(err,res){
		return next(null,res);
	})
}

//取出到负责银行和故障类型的一个技术人员和负责人 
exports.findByBankAndScope = function(mbank_id,mtype,next){
    myarr = [];
    myarr.push(mtype)
    var where = {bid:mbank_id,type:2,scope:{$in:myarr}};
     // 如果是ATM机则不分银行
    if(mtype.indexOf('(设备)')>0){
        console.log('不分银行')
        myarr = [];
        myarr.push(mtype)
        var where = {type:2,scope:{$in:myarr}};
    }
    user.findOne(where,function(err,data){
        if(!data){
            return next(null,'');
        }
        digui(data._id,null).then(function(udata){
            return next(null,udata);
        });
    })
}



var arr = new Array()
function digui(id,deferred){
    var deferred = deferred||Q.defer();
    user.findById({_id:id},['phone','type','pid'],function(err,data){
        // console.log(data)
        // deferred.resolve(data);

        arr.push(data);
        if(data==null){
            deferred.resolve(arr);
            arr=[];
            return false;
        }
        if (err) {
               deferred.reject(new Error(err));
        } else {
            if(data.pid!="0"){
                digui(data.pid,deferred);
            }else{
                deferred.resolve(arr);
                arr=[]
            }               
        }
    });
    return deferred.promise; // 这里返回一个承诺
}

// function digui(id,func){
//     user.findById({_id:id},['phone','type','pid'],function(err,data){
//         arr.push(data);
//         if(data.pid!="0"){
//             digui(data.pid,func);
//         }else{
//             func(arr);
//         }
//     });
// }

