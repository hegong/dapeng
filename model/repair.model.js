var mongoose = require('mongoose');
var repairSchema = new mongoose.Schema({
	phone:String,
	name:String,
	bank_id:String,
	type:String,
	describe:String,
	picture:String,
	charge:Array,
	byphone:String,
	time:{
		type:Date,
		default:Date.now
	},
	state:{
		type:String,
		default:"0"
	},//0 未处理 1已处理没有评价 2做出评价
	evaluate:{
		type:String,
		default:"0"
	},
	count:{
		type:String,
		default:"0"
	},
});

var repair = mongoose.model('repair',repairSchema);

exports.add = function(data,next) {
    var myrepair = new repair(data);
    myrepair.save(function(err,data){
        if(err){
            console.log("FATAL:"+err);
            next(err);
        }else{
        	next(err,data)
            console.log(data);
        }
    });
}

exports.list = function(req,res,next){
	// 对于这两个参数，还需要思考，如果用户传入负数怎么办
	var pagesize = parseInt(req.query.pagesize, 10) || 10;
	var pagestart = parseInt(req.query.pagestart, 10) || 1;
	console.log(req['where']);
	repair
	.find()
	.where(req['where'])
	// 搜索时，跳过的条数
	// .skip( (pagestart - 1) * pagesize )
	// // 获取的结果集条数
	// .limit( pagesize)
	.exec(function(err, docs){
	  if(err) return next(err);
	  return next(null,docs);
	});

}
exports.alllist = function(req,res,next){
	// 对于这两个参数，还需要思考，如果用户传入负数怎么办
	var pagesize = parseInt(req.query.pagesize, 10) || 10;
	var pagestart = parseInt(req.query.pagestart, 10) || 1;
	repair
	.find()
	// .where(req['where'])
	// 搜索时，跳过的条数
	.skip( (pagestart - 1) * pagesize )
	// 获取的结果集条数
	.limit( pagesize)
	.exec(function(err, docs){
	  if(err) return next(err);
	  return next(null,docs);
	});

}
exports.editdata = function(data,next) {
	console.log(data,11)
    repair.findByIdAndUpdate(
    	{_id:data.id},
    	{$set:data},
    	function(err,myrepair){
    		if(err){
             console.log(err);
             return;
         	}
         	console.log(myrepair,2);
      		return next(null,myrepair); //MDragon
   		 });
}
exports.delete = function(id,next) {
    repair.findByIdAndRemove(id,function (err, repair) {
         if(err){
             console.log(err);
             return;
         }
         return next(null,repair);
     });
}
// 未处理的保修列表
exports.getSendData = function(next) {
	var where = {state:"0"};
    repair.find(where,function (err, repair) {
         if(err){
             console.log(err);
             return;
         }
         return next(null,repair);
     });
}

