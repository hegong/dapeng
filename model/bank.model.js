var mongoose = require('mongoose');
var bankSchema = new mongoose.Schema({
	name:String,
	address:String,
    pid:String
});
var bank  = mongoose.model('bank',bankSchema);
exports.add = function(data,next) {
    var mybank = new bank(data);
    mybank.save(function(err,data){
        if(err){
            console.log("FATAL:"+err);
            next(err);
        }else{
            console.log(data);
        }
    });
}

exports.list = function(req,res,next){
    
	// 对于这两个参数，还需要思考，如果用户传入负数怎么办
	var pagesize = parseInt(req.query.pagesize, 10) || 100;
	var pagestart = parseInt(req.query.pagestart, 10) || 1;
	bank
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
    bank.findByIdAndRemove(id,function (err, data) {
         if(err){
             console.log(err);
             return;
         }
         return next(null,data);
     });
}

exports.edit = function(id,next) {
    bank.findById(id,function (err, data) {
         
         if(err){
             console.log(err);
             return;
         }
         return next(null,data);
     });
}
exports.editdata = function(data,next) {
	console.log(data,111333444);
    bank.findByIdAndUpdate(
    	{_id:data.id},
    	{$set:data},
    	function(err,mybank){
    		if(err){
             console.log(err);
             return;
         	}
      		return next(null,mybank); //MDragon
   		 });
}

exports.findByBankId = function(id,next) {
    bank.findById(id, function(err,mybank){
            if(err){
             console.log(err);
             return;
            }
            return next(null,mybank); //MDragon
         });
}

exports.findByBankId = function(id,next) {
    bank.findById(id, function(err,mybank){
            if(err){
             console.log(err);
             return;
            }
            return next(null,mybank); //MDragon
         });
}

exports.findByBankPid = function(next) {
    var where = {"pid":"0"};
    bank.find(where, function(err,mybank){
            if(err){
             console.log(err);
             return;
            }
            console.log(mybank,111111111);
            return next(null,mybank); //MDragon
    });
}
