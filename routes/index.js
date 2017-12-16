//引入集合操作方法
var User = require('../model/User');
//引入一个加密插件
var crypto = require('crypto');
module.exports = function (app) {
    app.get('/',function (req,res) {
        var page = parseInt(req.query.page) || 1;

        User.getTen(null,page,function (err,docs,total) {
            console.log(total);
            res.render('index',{
                title:'首页',
                page:page,
                isFirstPage:(page - 1) *5 == 0,
                isLastPage:(page - 1) * 5 + docs.length == total,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                docs : docs,
            })
        })

    })
    // 注册页面
    app.get('/reg',function (req,res) {
        res.render('reg',{
            title:'注册新用户',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    //注册行为
    app.post('/reg',function (req,res) {
    //把数据存放到数据库中
    //    1.收集数据
        var username = req.body.username;
        var password = req.body.password;
        var password_repeat = req.body['password_repeat'];


    //     2.判断两次密码是否正确
        if(password != password_repeat){
            req.flash('error','两次密码输入不正确');
            return res.redirect('/reg');
        }
    //     3.对密码进行加密
        var md5 = crypto.createHash('md5');
        password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            username :username,
            reallyname : req.body.reallyname,
            password :password,
            phone :req.body.phone,
            email:req.body.email,
        })
        // 4.
        User.get(newUser.username,function (err,user) {
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            if(user){
                req.flash('error','用户名已存在');
                return res.redirect('/reg');
            }

    //    5.
        newUser.save(function (err,user) {
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success','添加成功');
            return res.redirect('/');

        })
        })
    })
    //登录
    app.get('/login',function (req,res) {
        res.render('login',{
            title:'登录页面',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    //登录行为
    app.post('/login',function (req,res) {
        

    })
    // 删除页面
    // app.get('/delete',function (req,res) {
    //     res.render('delete',{
    //         title:'删除用户',
    //         user:req.session.user,
    //         success:req.flash('success').toString(),
    //         error:req.flash('error').toString()
    //     })
    // })
    // 删除行为
    app.get('/remove/:username/:time',function (req,res) {
        User.remove(req.params.name,req.params.time,function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            req.flash('success','删除成功');
            return res.redirect('/');
        })
    })
    //编辑修改页面
    app.get('/edit/:username/:time',function (req,res) {
       User.edit(req.params.name,req.params.time,function (err,doc) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            return res.render('edit',{
                title:'修改用户信息',
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                doc:doc
            })
        })
    })
//    编辑修改行为
    app.post('/edit/:username',function (req,res) {
        User.update(req.params.username,req.body.phone,req.body.email,function(err,doc){
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            req.flash('success','修改成功');
            return res.redirect('/');
        })
    })
//搜索用户
    app.get('/search',function (req,res) {
        User.search(req.query.keyword,function (err,docs) {
            if(err){
                req.flash('error',err);
                return res.redirect('/')
            }
            return res.render('search',{
                title:'搜索结果',
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                docs:docs
            })
        })
    })
}
