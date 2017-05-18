var express = require('express');
var router = express.Router();
/* GET banks listing. */
router.get('/set', function(req, res, next) {
 res.render('set'); 
});
router.post('/settime',function(req, res, next) {
 	console.log("111"); 
 		
});
module.exports = router;