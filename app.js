var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var bank = require('./routes/bank');
var login = require('./routes/login');
var fault = require('./routes/fault');
var repair = require('./routes/repair');
var verify = require('./routes/verify');
var system = require('./routes/system');
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 },
             auto_reconnect: true,
              poolSize: 10
          },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/bank',options);
// 实例化连接对象
const db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误：'));
db.once('open', (callback) => {
  console.log('数据库连接成功！！');
  console.log('项目启动成功');
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    resave:false,
    saveUninitialized: false,
    secret: 'secret',
    cookie:{
        maxAge: 1000*60*30
    }
}));
app.use(function(req, res, next){
  req.session._garbage = Date();
  req.session.touch();
  next();
});
// 为数组添加一个方法
Array.prototype.contains = function (obj) {  
    var i = this.length;  
    while (i--) {  
        if (this[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
} 

fiterArrayList =  [
'/login/login',//登录
'/login/loginadmin',//登录后台
'/verify/list',//获取验证码
'/repair/getSendData',//获取保修技术人员和负责人员
'/verify/editdata',//修改验证码状态
'/repair/editdata',//修改保修状态
"/login/phoneExist",
"/login/add",
"/system/set"
];
app.use(function(req,res,next){  
    if (!req.session.user) {  
        // if(req.url=="/login/login"){
        if(fiterArrayList.contains(req.url)){ 
            next();//如果请求的地址是登录则通过，进行下一个请求  
        }else{  
            res.redirect('/login/login');  
        }  
    } else if (req.session.user) {  
        next();  
    }  
}); 

app.use('/index', index);
app.use('/users', users);
app.use('/login', login);
app.use('/bank', bank);
app.use('/fault', fault);
app.use('/repair', repair);
app.use('/verify', verify);
app.use('/system', system);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
// 根据session 电话拿出保修列表信息