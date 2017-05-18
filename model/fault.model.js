var mongoose = require('mongoose');
var faultSchema = new mongoose.Schema({
	type:String,
	pid:String,
});
var fault  = mongoose.model('fault',faultSchema);
exports.add = function(data,next) {
    var myfault = new fault(data);
    myfault.save(function(err,data){
        if(err){
            console.log("FATAL:"+err);
            next(err);
        }else{
            console.log(data);
        }
    });
}

exports.list = function(req,res,next){
    console.log(1111)
	// 对于这两个参数，还需要思考，如果用户传入负数怎么办
	var pagesize = parseInt(req.query.pagesize, 10) || 10;
	var pagestart = parseInt(req.query.pagestart, 10) || 1;
	fault
	.find()
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
    fault.findByIdAndRemove(id,function (err, data) {
         if(err){
             console.log(err);
             return;
         }
         return next(null,data);
     });
}

exports.edit = function(id,next) {
    fault.findById(id,function (err, data) {
         
         if(err){
             console.log(err);
             return;
         }
         return next(null,data);
     });
}
exports.editdata = function(data,next) {
	console.log(data,111333444);
    fault.findByIdAndUpdate(
    	{_id:data.id},
    	{$set:{type:data.type}},
    	function(err,myfault){
    		if(err){
             console.log(err);
             return;
         	}
      		return next(null,myfault); //MDragon
   		 });
}

