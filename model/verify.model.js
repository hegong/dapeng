var mongoose = require('mongoose');
var verifySchema = new mongoose.Schema({
	phone:String,
	verify:String,
    state:{
        type:String,
        default:0  //0 未发送，1已经发送，2已经使用
    }
});
var verify  = mongoose.model('verify',verifySchema);
exports.add = function(data,next) {
    var myverify = new verify(data);
    myverify.save(function(err,data){
        if(err){
            console.log("FATAL:"+err);
            next(err);
        }else{
            next(data);
        }
    });
}

exports.list = function(req,res,next){
    
	// 对于这两个参数，还需要思考，如果用户传入负数怎么办
	var pagesize = parseInt(req.query.pagesize, 10) || 100;
	var pagestart = parseInt(req.query.pagestart, 10) || 1;
	verify
	.find()
    .where("state",0)
	// 搜索时，跳过的条数
	// .skip( (pagestart - 1) * pagesize )
	// // 获取的结果集条数
	// .limit( pagesize)
	.exec(function(err, docs){
	  if(err) return next(err);
	  return next(null,docs);
	});

}
exports.delete = function(id,next) {
    verify.findByIdAndRemove(id,function (err, data) {
         if(err){
             console.log(err);
             return;
         }
         return next(null,data);
     });
}

exports.edit = function(id,next) {
    verify.findById(id,function (err, data) {
         
         if(err){
             console.log(err);
             return;
         }
         return next(null,data);
     });
}
exports.editdata = function(data,next) {
    verify.findByIdAndUpdate(
    	{_id:data.id},
    	{$set:data},
    	function(err,myverify){
    		if(err){
             console.log(err);
             return;
         	}
      		return next(null,myverify); //MDragon
   		 });
}

exports.findByVerifyId = function(id,next) {
    verify.findById(id, function(err,myverify){
            if(err){
             console.log(err);
             return;
            }
            return next(null,myverify); //MDragon
         });
}

exports.findByVerifyId = function(id,next) {
    verify.findById(id, function(err,myverify){
            if(err){
             console.log(err);
             return;
            }
            return next(null,myverify); //MDragon
         });
}
//通过手机号码和验证码和状态1
exports.findByVerifyPhone = function(data,next) {
    verify.findOne({phone:data.phone,verify:data.verify,state:"1"}, function(err,myverify){
            if(err){
             console.log(err);
             return;
            }
            return next(null,myverify); //MDragon
    });
}
