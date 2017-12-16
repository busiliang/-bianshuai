var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//引入数据库
var setting = require('./setting');
// var db = require('./model/db')
//引入flash
var flash = require('connect-flash');
//session插件
var session = require('express-session');
// session存放数据的插件
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public



app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//使用flash
app.use(flash());
app.use(session({
    //加密
    secret:setting.cookieSecret,
    //设置cookie过期时间
    cookie:{Maxsge:1000*60*60*24*30},
    //加密
    key:setting.db,
    // 连接数据库地址
    store:new MongoStore({
        url:'mongodb://localhost/blog'
    }),
    //是否强制删除保存会话
    resave:false,
    // 会话未修改的时候，是否保存
    saveUninitialized:true
}))

//将APP传给路由函数使用
routes(app);

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
//添加监听
app.listen(3000,function () {
    console.log('node is OK');
})

module.exports = app;




